# Vue 模版编译原理
# Vue 2.0 模版编译原理
- Vue 底层是通过虚拟 DOM 来进行渲染的，那么 .vue 文件的模板到底是怎么转换成虚拟 DOM 的呢？让我们一起来看看吧！

## Vue的版本
- vue.js：完整版本，包含了模板编译的能力；
- vue.runtime.js：运行时版本，不提供模板编译能力，需要通过 vue-loader 进行提前编译。
::: tip 比较
如果你用了 vue-loader ，就可以使用 vue.runtime.min.js，将模板编译的过程交过 vue-loader，如果你是在浏览器中直接通过 script 标签引入 Vue，需要使用 vue.min.js，运行的时候编译模板。
:::

## 编译入口
- 了解了 Vue 的版本，我们看看 Vue 完整版的入口文件（src/platforms/web/entry-runtime-with-compiler.js）
``` js
// 省略了部分代码，只保留了关键部分
import { compileToFunctions } from './compiler/index'

const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (el) {
  const options = this.$options
  
  // 如果没有 render 方法，则进行 template 编译
  if (!options.render) {
    let template = options.template
    if (template) {
      // 调用 compileToFunctions，编译 template，得到 render 方法
      const { render, staticRenderFns } = compileToFunctions(template, {
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      // 这里的 render 方法就是生成生成虚拟 DOM 的方法
      options.render = render
    }
  }
  return mount.call(this, el, hydrating)
}
```
- 再看看 ./compiler/index 文件的 compileToFunctions 方法从何而来。
``` js
import { baseOptions } from './options'
import { createCompiler } from 'compiler/index'

// 通过 createCompiler 方法生成编译函数
const { compile, compileToFunctions } = createCompiler(baseOptions)
export { compile, compileToFunctions }
```
- 后续的主要逻辑都在 compiler 模块中，这一块有些绕，因为本文不是做源码分析，就不贴整段源码了。简单看看这一段的逻辑是怎么样的。
``` js
export function createCompiler(baseOptions) {
  const baseCompile = (template, options) => {
    // 解析 html，转化为 ast
    const ast = parse(template.trim(), options)
    // 优化 ast，标记静态节点
    optimize(ast, options)
    // 将 ast 转化为可执行代码
    const code = generate(ast, options)
    return {
      ast,
      render: code.render,
      staticRenderFns: code.staticRenderFns
    }
  }
  const compile = (template, options) => {
    const tips = []
    const errors = []
    // 收集编译过程中的错误信息
    options.warn = (msg, tip) => {
      (tip ? tips : errors).push(msg)
    }
    // 编译
    const compiled = baseCompile(template, options)
    compiled.errors = errors
    compiled.tips = tips

    return compiled
  }
  const createCompileToFunctionFn = () => {
    // 编译缓存
    const cache = Object.create(null)
    return (template, options, vm) => {
      // 已编译模板直接走缓存
      if (cache[template]) {
        return cache[template]
      }
      const compiled = compile(template, options)
     return (cache[key] = compiled)
    }
  }
  return {
    compile,
    compileToFunctions: createCompileToFunctionFn(compile)
  }
}
```
- 最终 baseCompile 的返回值如下：
``` js
return {
  ast,
  render: code.render,
  staticRenderFns: code.staticRenderFns
}
```
可以看到，其最终返回了抽象语法树(ast)，渲染函数(render)，静态渲染函数(staticRenderFns)，且 render 的值为 code.render，staticRenderFns 的值为 code.staticRenderFns，也就是说通过 generate 处理 ast 之后得到的返回值 code 是一个对象，该对象的属性中包含了渲染函数（注意以上提到的渲染函数，都以字符串的形式存在，因为真正变成函数的过程是在 compileToFunctions 中使用 new Function() 来完成的

## 主流程
可以看到主要的编译逻辑基本都在 baseCompile 方法内，主要分为三个步骤：
- 模板编译，将模板代码转化为 AST；
- 优化 AST，方便后续虚拟 DOM 更新；
- 生成代码，将 AST 转化为可执行的代码；
``` js
const baseCompile = (template, options) => {
  // 解析 html，转化为 ast
  const ast = parse(template.trim(), options)
  // 优化 ast，标记静态节点
  optimize(ast, options)
  // 将 ast 转化为可执行代码
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
}
```

## parse
在说 parser 之前，我们先了解一下编译器的概念，简单的讲编译器就是将 源代码 转换成 目标代码 的工具。详细一点如下(引用自维基百科)：

::: des
它主要的目的是将便于人编写、阅读、维护的高级计算机语言所写作的 源代码 程序，翻译为计算机能解读、运行的低阶机器语言的程序。源代码 一般为高阶语言（High-level language），如Pascal、C、C++、C# 、Java等，而目标语言则是汇编语言或目标机器的目标代码（Object code）。
:::

parser 是把某种特定格式的文本转换成某种数据结构的程序，其中“特定格式的文本”可以理解为普通的字符串，而 parser 的作用就是将这个字符串转换成一种数据结构(通常是一个对象)，并且这个数据结构是编译器能够理解的，因为编译器的后续步骤，比如上面提到的 句法分析，类型检查/推导，代码优化，代码生成 等等都依赖于该数据结构，正因如此我们才说 parser 是编译器处理源代码的第一步，并且这种数据结构是抽象的，我们常称其为抽象语法树，即 AST。

### AST
首先看到 parse 方法，该方法的主要作用就是解析 HTML，并转化为 AST（抽象语法树），接触过 ESLint、Babel 的同学肯定对 AST 不陌生，我们可以先看看经过 parse 之后的 AST 长什么样。
下面是一段普普通通的 Vue 模板：

``` js

new Vue({
  el: '#app',
  template: `
    <div>
      <h2 v-if="message">{{message}}</h2>
      <button @click="showName">showName</button>
    </div>
  `,
  data: {
    name: 'shenfq',
    message: 'Hello Vue!'
  },
  methods: {
    showName() {
      alert(this.name)
    }
  }
})
```

经过 parse 之后的 AST
AST 为一个树形结构的对象，每一层表示一个节点。
第一层就是 div（tag: "div"）。div 的子节点都在 children 属性中，分别是 h2 标签、空行、button 标签。我们还可以注意到有一个用来标记节点类型的属性：type，这里 div 的 type 为 1，表示是一个元素节点。

type 一共有三种类型：
- 元素节点；
- 表达式；
- 文本；

在 h2 和 button 标签之间的空行就是 type 为 3 的文本节点，而 h2 标签下就是一个表达式节点。

### 解析HTML
parse 的整体逻辑较为复杂，我们可以先简化一下代码，看看 parse 的流程。
``` js

import { parseHTML } from './html-parser'

export function parse(template, options) {
  let root
  parseHTML(template, {
    // some options...
    start() {}, // 解析到标签位置开始的回调
    end() {}, // 解析到标签位置结束的回调
    chars() {}, // 解析到文本时的回调
    comment() {} // 解析到注释时的回调
  })
  return root
}
```
可以看到 parse 主要通过 parseHTML 进行工作，这个 parseHTML 本身来自于开源库：simple html parser，只不过经过了 Vue 团队的一些修改，修复了相关 issue。

下面我们一起来理一理 parseHTML 的逻辑。
``` js
export function parseHTML(html, options) {
  let index = 0
  let last,lastTag
  const stack = []
  while(html) {
    last = html
    let textEnd = html.indexOf('<')

    // "<" 字符在当前 html 字符串开始位置
    if (textEnd === 0) {
      // 1、匹配到注释: <!-- -->
      if (/^<!\--/.test(html)) {
        const commentEnd = html.indexOf('-->')
        if (commentEnd >= 0) {
          // 调用 options.comment 回调，传入注释内容
          options.comment(html.substring(4, commentEnd))
          // 裁切掉注释部分
          advance(commentEnd + 3)
          continue
        }
      }

      // 2、匹配到条件注释: <![if !IE]>  <![endif]>
      if (/^<!\[/.test(html)) {
        // ... 逻辑与匹配到注释类似
      }

      // 3、匹配到 Doctype: <!DOCTYPE html>
      const doctypeMatch = html.match(/^<!DOCTYPE [^>]+>/i)
      if (doctypeMatch) {
        // ... 逻辑与匹配到注释类似
      }

      // 4、匹配到结束标签: </div>
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {}

      // 5、匹配到开始标签: <div>
      const startTagMatch = parseStartTag()
      if (startTagMatch) {}
    }
    // "<" 字符在当前 html 字符串中间位置
    let text, rest, next
    if (textEnd > 0) {
      // 提取中间字符
      rest = html.slice(textEnd)
      // 这一部分当成文本处理
      text = html.substring(0, textEnd)
      advance(textEnd)
    }
    // "<" 字符在当前 html 字符串中不存在
    if (textEnd < 0) {
      text = html
      html = ''
    }
    
    // 如果存在 text 文本
    // 调用 options.chars 回调，传入 text 文本
    if (options.chars && text) {
      // 字符相关回调
      options.chars(text)
    }
  }
  // 向前推进，裁切 html
  function advance(n) {
    index += n
    html = html.substring(n)
  }
}

````

上述代码为简化后的 parseHTML，while 循环中每次截取一段 html 文本，然后通过正则判断文本的类型进行处理，这就类似于编译原理中常用的有限状态机。每次拿到 "<" 字符前后的文本，"<" 字符前的就当做文本处理，"<" 字符后的通过正则判断，可推算出有限的几种状态。

其他的逻辑处理都不复杂，主要是开始标签与结束标签，我们先看看关于开始标签与结束标签相关的正则。
``` js
const ncname = '[a-zA-Z_][\\w\\-\\.]*'
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)

// 来提取标签属性的正则
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
````

理清正则后可以更加方便我们看后面的代码。
``` js
while(html) {
  last = html
  let textEnd = html.indexOf('<')

  // "<" 字符在当前 html 字符串开始位置
  if (textEnd === 0) {
    // some code ...

    // 4、匹配到标签结束位置: </div>
    const endTagMatch = html.match(endTag)
    if (endTagMatch) {
      const curIndex = index
      advance(endTagMatch[0].length)
      parseEndTag(endTagMatch[1], curIndex, index)
      continue
    }

    // 5、匹配到标签开始位置: <div>
    const startTagMatch = parseStartTag()
    if (startTagMatch) {
      handleStartTag(startTagMatch)
      continue
    }
  }
}
// 向前推进，裁切 html
function advance(n) {
  index += n
  html = html.substring(n)
}

// 判断是否标签开始位置，如果是，则提取标签名以及相关属性
function parseStartTag () {
  // 提取 <xxx
  const start = html.match(startTagOpen)
  if (start) {
    const [fullStr, tag] = start
    const match = {
      attrs: [],
      start: index,
      tagName: tag,
    }
    advance(fullStr.length)
    let end, attr
    // 递归提取属性，直到出现 ">" 或 "/>" 字符
    while (
      !(end = html.match(startTagClose)) &&
      (attr = html.match(attribute))
    ) {
      advance(attr[0].length)
      match.attrs.push(attr)
    }
    if (end) {
      // 如果是 "/>" 表示单标签
      match.unarySlash = end[1]
      advance(end[0].length)
      match.end = index
      return match
    }
  }
}

// 处理开始标签
function handleStartTag (match) {
  const tagName = match.tagName
  const unary = match.unarySlash
  const len = match.attrs.length
  const attrs = new Array(len)
  for (let i = 0; i < l; i++) {
    const args = match.attrs[i]
    // 这里的 3、4、5 分别对应三种不同复制属性的方式
    // 3: attr="xxx" 双引号
    // 4: attr='xxx' 单引号
    // 5: attr=xxx   省略引号
    const value = args[3] || args[4] || args[5] || ''
    attrs[i] = {
      name: args[1],
      value
    }
  }

  if (!unary) {
    // 非单标签，入栈
    stack.push({
      tag: tagName,
      lowerCasedTag:
      tagName.toLowerCase(),
      attrs: attrs
    })
    lastTag = tagName
  }

  if (options.start) {
    // 开始标签的回调
    options.start(tagName, attrs, unary, match.start, match.end)
  }
}

// 处理闭合标签
function parseEndTag (tagName, start, end) {
  let pos, lowerCasedTagName
  if (start == null) start = index
  if (end == null) end = index

  if (tagName) {
    lowerCasedTagName = tagName.toLowerCase()
  }

  // 在栈内查找相同类型的未闭合标签
  if (tagName) {
    for (pos = stack.length - 1; pos >= 0; pos--) {
      if (stack[pos].lowerCasedTag === lowerCasedTagName) {
        break
      }
    }
  } else {
    pos = 0
  }

  if (pos >= 0) {
    // 关闭该标签内的未闭合标签，更新堆栈
    for (let i = stack.length - 1; i >= pos; i--) {
      if (options.end) {
        // end 回调
        options.end(stack[i].tag, start, end)
      }
    }

    // 堆栈中删除已关闭标签
    stack.length = pos
    lastTag = pos && stack[pos - 1].tag
  }
}
```
在解析开始标签的时候，如果该标签不是单标签，会将该标签放入到一个堆栈当中，每次闭合标签的时候，会从栈顶向下查找同名标签，直到找到同名标签，这个操作会闭合同名标签上面的所有标签。