# Vue内置组件keep-alive内部原理

## keep-alive基本概念

`<keep-alive>`是Vue中内置的一个抽象组件，它自身不会渲染一个 DOM 元素，也不会出现在父组件链中。当它包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。

这句话的意思简单来说：就是我们可以把一些不常变动的组件或者需要缓存的组件用`<keep-alive>`包裹起来，这样`<keep-alive>`就会帮我们把组件保存在内存中，而不是直接的销毁，这样做可以保留组件的状态或避免多次重新渲染，以提高页面性能。

## 用法

### `<keep-alive>`组件可接收三个属性：
	+ include - 字符串或正则表达式。只有名称匹配的组件会被缓存。
	+ exclude - 字符串或正则表达式。任何名称匹配的组件都不会被缓存。
	+ max - 数字。最多可以缓存多少组件实例。
include 和 exclude 属性允许组件有条件地缓存。二者都可以用逗号分隔字符串、正则表达式或一个数组来表示：
```vue
<!-- 逗号分隔字符串 -->
<keep-alive include="a,b">
  <component :is="view"></component>
</keep-alive>

<!-- 正则表达式 (使用 `v-bind`) -->
<keep-alive :include="/a|b/">
  <component :is="view"></component>
</keep-alive>

<!-- 数组 (使用 `v-bind`) -->
<keep-alive :include="['a', 'b']">
  <component :is="view"></component>
</keep-alive>
```

匹配时首先检查组件自身的 `name` 选项，如果 `name` 选项不可用，则匹配它的局部注册名称 (父组件 `components` 选项的键值)，也就是组件的标签值。匿名组件不能被匹配。

max表示最多可以缓存多少组件实例。一旦这个数字达到了，在新实例被创建之前，已缓存组件中最久没有被访问的实例会被销毁掉。

请读者注意此处加粗的地方，暂时有个印象，后面我们会详细说明。

``` vue
<keep-alive :max="10">
  <component :is="view"></component>
</keep-alive>
```

OK，以上就是`<keep-alive>`组件的官方介绍及其用法，下面我们将着重介绍其内部实现原理。

## 实现原理
`<keep-alive>` 是 Vue 源码中实现的一个组件，也就是说 Vue 源码不仅实现了一套组件化的机制，也实现了一些内置组件，该组件的定义在 src/core/components/keep-alive.js 中：

``` js
export default {
  name: 'keep-alive',
  abstract: true,	// 抽象组件

  props: {
    include: [String, RegExp, Array],
    exclude: [String, RegExp, Array],
    max: [String, Number]
  },

  created () {
    this.cache = Object.create(null)
    this.keys = []
  },

  destroyed () {
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted () {
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },

  render() {
    /* 获取默认插槽中的第一个组件节点 */
    const slot = this.$slots.default
    const vnode = getFirstComponentChild(slot)
    /* 获取该组件节点的componentOptions */
    const componentOptions = vnode && vnode.componentOptions

    if (componentOptions) {
      /* 获取该组件节点的名称，优先获取组件的name字段，如果name不存在则获取组件的tag */
      const name = getComponentName(componentOptions)

      const { include, exclude } = this
      /* 如果name不在inlcude中或者存在于exlude中则表示不缓存，直接返回vnode */
      if (
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      const { cache, keys } = this
      const key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
        // make current key freshest
        remove(keys, key)
        keys.push(key)
      } else {
        cache[key] = vnode
        keys.push(key)
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }

      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
}
```
这是该组件的源码，是不是突然看到一大片代码有点惊慌失措，哈哈哈，不要急不要慌，接下来我们抽丝剥茧，逐个击破。

`kepp-alive`实际是一个抽象组件，只对包裹的子组件做处理，并不会和子组件建立父子关系，也不会作为节点渲染到页面上。在组件开头就设置abstract为true，代表该组件是一个抽象组件。
那么抽象组件是如何忽略这层关系的呢？在初始化阶段会调用initLifecycle，里面判断父级是否为抽象组件，如果是抽象组件，就选取抽象组件的上一级作为父级，忽略与抽象组件和子组件之间的层级关系。
``` js
// 源码位置：src/core/instance/lifecycle.js
export function initLifecycle (vm: Component) {
  const options = vm.$options

  // locate first non-abstract parent
  let parent = options.parent
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent
    }
    parent.$children.push(vm)
  }
  vm.$parent = parent
  // ...
}
```

言归正传
首先我们可以看到该组件内没有常规的`<template></template>`等标签，因为它不是一个常规的模板组件，取而代之的是它内部多了一个叫做render的函数，它是一个函数式组件，执行` <keep-alive> `组件渲染的时候，就会执行到这个 render 函数。了解了这个以后，接下来我们从上到下一步一步细细阅读。

### props
在props选项内接收传进来的三个属性：`include`、`exclude`和`max`。如下：
``` js
props: {
    include: [String, RegExp, Array],
    exclude: [String, RegExp, Array],
    max: [String, Number]
}
```
`include`表示只有匹配到的组件会被缓存，而`exclude`表示任何匹配到的组件都不会被缓存，`max`表示缓存组件的数量，因为我们是缓存的`vnode`对象，它也会持有 DOM，当我们缓存的组件很多的时候，会比较占用内存，所以该配置允许我们指定缓存组件的数量。

### created
在`created`钩子函数里定义并初始化了两个属性：`this.cache`和`this.keys`。
``` js
created () {
    this.cache = Object.create(null)
    this.keys = []
}
```

`this.cache`是一个对象，用来存储需要缓存的组件，它将以如下形式存储：
``` js
this.cache = {
    'key1':'组件1',
    'key2':'组件2',
    // ...
}
```
`this.keys`是一个数组，用来存储每个需要缓存的组件的`key`，即对应`this.cache`对象中的键值。

### destroyed
当`<keep-alive>`组件被销毁时，此时会调用`destroyed`钩子函数，在该钩子函数里会遍历`this.cache`对象，然后将那些被缓存的并且当前没有处于被渲染状态的组件都销毁掉。如下：

``` js
destroyed () {
    for (const key in this.cache) {
        pruneCacheEntry(this.cache, key, this.keys)
    }
}

// pruneCacheEntry函数
function pruneCacheEntry (
  cache: VNodeCache,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
  const cached = cache[key]
  /* 判断当前没有处于被渲染状态的组件，将其销毁*/
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy()
  }
  cache[key] = null
  remove(keys, key)
}
```

### mounted
在`mounted`钩子函数中观测`include`和`exclude`的变化，如下：
``` js
mounted () {
    this.$watch('include', val => {
        pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
        pruneCache(this, name => !matches(val, name))
    })
}
```
如果`include`或`exclude`发生了变化，即表示定义需要缓存的组件的规则或者不需要缓存的组件的规则发生了变化，那么就执行`pruneCache`函数，函数如下：
``` js
function pruneCache (keepAliveInstance, filter) {
  const { cache, keys, _vnode } = keepAliveInstance
  for (const key in cache) {
    const cachedNode = cache[key]
    if (cachedNode) {
      const name = getComponentName(cachedNode.componentOptions)
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode)
      }
    }
  }
}
```
在该函数内对`this.cache`对象进行遍历，取出每一项的`name`值，用其与新的缓存规则进行匹配，如果匹配不上，则表示在新的缓存规则下该组件已经不需要被缓存，则调用`pruneCacheEntry`函数将其从`this.cache`对象剔除即可。

### render
接下来就是重头戏render函数，也是本篇文章中的重中之重。以上工作都是一些辅助工作，真正实现缓存功能的就在这个render函数里，接下来我们逐行分析它。

在render函数中首先获取第一个子组件节点的 vnode：
``` js
/* 获取默认插槽中的第一个组件节点 */
const slot = this.$slots.default
const vnode = getFirstComponentChild(slot)
```
如果keep-alive存在多个子元素，keep-alive要求同时只有一个子元素被渲染。所以在开头会获取插槽内的子元素，调用getFirstComponentChild获取到第一个子元素的VNode。
```js
// check pattern
const name: ?string = getComponentName(componentOptions)
const { include, exclude } = this
if (
  // not included
  (include && (!name || !matches(include, name))) ||
  // excluded
  (exclude && name && matches(exclude, name))
) {
  return vnode
}

function matches (pattern: string | RegExp | Array<string>, name: string): boolean {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  return false
}
```


由于我们也是在 `<keep-alive>` 标签内部写 DOM，所以可以先获取到它的默认插槽，然后再获取到它的第一个子节点。`<keep-alive>`只处理第一个子元素，所以一般和它搭配使用的有 component 动态组件或者是 router-view。

接下来获取该组件节点的名称：
``` js
/* 获取该组件节点的名称 */
const name = getComponentName(componentOptions)

/* 优先获取组件的name字段，如果name不存在则获取组件的tag */
function getComponentName (opts: ?VNodeComponentOptions): ?string {
  return opts && (opts.Ctor.options.name || opts.tag)
}
```

然后用组件名称跟 include、exclude 中的匹配规则去匹配：
``` js
const { include, exclude } = this
/* 如果name与include规则不匹配或者与exclude规则匹配则表示不缓存，直接返回vnode */
if (
    (include && (!name || !matches(include, name))) ||
    // excluded
    (exclude && name && matches(exclude, name))
) {
    return vnode
}
```

如果组件名称与 include 规则不匹配或者与 exclude 规则匹配，则表示不缓存该组件，直接返回这个组件的 vnode，否则的话走下一步缓存：
```js
const { cache, keys } = this
/* 获取组件的key */
const key = vnode.key == null
? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
: vnode.key

/* 如果命中缓存，则直接从缓存中拿 vnode 的组件实例 */
if (cache[key]) {
    vnode.componentInstance = cache[key].componentInstance
    /* 调整该组件key的顺序，将其从原来的地方删掉并重新放在最后一个 */
    remove(keys, key)
    keys.push(key)
} 
/* 如果没有命中缓存，则将其设置进缓存 */
else {
    cache[key] = vnode
    keys.push(key)
    /* 如果配置了max并且缓存的长度超过了this.max，则从缓存中删除第一个 */
    if (this.max && keys.length > parseInt(this.max)) {
        pruneCacheEntry(cache, keys[0], keys, this._vnode)
    }
}
/* 最后设置keepAlive标记位 */
vnode.data.keepAlive = true
```

首先获取组件的key值：
``` js
const key = vnode.key == null? 
componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
: vnode.key
```

拿到key值后去this.cache对象中去寻找是否有该值，如果有则表示该组件有缓存，即命中缓存：
``` js
/* 如果命中缓存，则直接从缓存中拿 vnode 的组件实例 */
if (cache[key]) {
    vnode.componentInstance = cache[key].componentInstance
    /* 调整该组件key的顺序，将其从原来的地方删掉并重新放在最后一个 */
    remove(keys, key)
    keys.push(key)
} 
```

直接从缓存中拿 vnode 的组件实例，此时重新调整该组件key的顺序，将其从原来的地方删掉并重新放在this.keys中最后一个。

如果this.cache对象中没有该key值：
``` js
/* 如果没有命中缓存，则将其设置进缓存 */
else {
    cache[key] = vnode
    keys.push(key)
    /* 如果配置了max并且缓存的长度超过了this.max，则从缓存中删除第一个 */
    if (this.max && keys.length > parseInt(this.max)) {
        pruneCacheEntry(cache, keys[0], keys, this._vnode)
    }
}
```
表明该组件还没有被缓存过，则以该组件的key为键，组件vnode为值，将其存入this.cache中，并且把key存入this.keys中。此时再判断this.keys中缓存组件的数量是否超过了设置的最大缓存数量值this.max，如果超过了，则把第一个缓存组件删掉。

::: danger 那么问题来了：
为什么要删除第一个缓存组件并且为什么命中缓存了还要调整组件key的顺序？
:::

这其实应用了一个缓存淘汰策略LRU：
> LRU（Least recently used，最近最少使用）算法根据数据的历史访问记录来进行淘汰数据，其核心思想是“如果数据最近被访问过，那么将来被访问的几率也更高”。
> LRU策略的设计原则是，如果一个数据在最近一段时间没有被访问到，那么在将来它被访问的可能性也很小。也就是说，当限定的空间已存满数据时，应当把最久没有被访问到的数据淘汰。

::: tip 算法
1、将新数据从尾部插入到this.keys中；

2、每当缓存命中（即缓存数据被访问），则将数据移到this.keys的尾部；

3、当this.keys满的时候，将头部的数据丢弃；
:::

LRU的核心思想是如果数据最近被访问过，那么将来被访问的几率也更高，所以我们将命中缓存的组件key重新插入到this.keys的尾部，这样一来，this.keys中越往头部的数据即将来被访问几率越低，所以当缓存数量达到最大值时，我们就删除将来被访问几率最低的数据，即this.keys中第一个缓存的组件。这也就是在1.2节中加粗强调的已缓存组件中最久没有被访问的实例会被销毁掉的原因所在。
keep-alive缓存机制便是根据LRU策略来设置缓存组件新鲜度，将很久未访问的组件从缓存中删除。
OK，言归正传，以上工作做完后设置 vnode.data.keepAlive = true ，最后将vnode返回。

小结：cache用于缓存组件，keys存储组件的key，根据LRU策略来调整缓存组件。keep-alive的render中最后会返回组件的VNode，因此我们也可以得出一个结论，keep-alive并非真的不会渲染，而是渲染的对象是包裹的子组件。
以上就是render函数的整个过程。


### 生命周期钩子
组件一旦被`<keep-alive>`缓存，那么再次渲染的时候就不会执行 created、mounted 等钩子函数，但是我们很多业务场景都是希望在我们被缓存的组件再次被渲染的时候做一些事情，好在Vue 提供了 activated和deactivated 两个钩子函数，它的执行时机是`<keep-alive>`包裹的组件激活时调用和停用时调用，下面我们就通过一个简单的例子来演示一下这两个钩子函数，示例如下：

``` js
let A = {
  template: '<div class="a">' +
  '<p>A Comp</p>' +
  '</div>',
  name: 'A',
  mounted(){
  	console.log('Comp A mounted')
  },
  activated(){
  	console.log('Comp A activated')  
  },
  deactivated(){
  	console.log('Comp A deactivated')  
  }
}

let B = {
  template: '<div class="b">' +
  '<p>B Comp</p>' +
  '</div>',
  name: 'B',
  mounted(){
  	console.log('Comp B mounted')
  },
  activated(){
  	console.log('Comp B activated')  
  },
  deactivated(){
  	console.log('Comp B deactivated')  
  }
}

let vm = new Vue({
  el: '#app',
  template: '<div>' +
  '<keep-alive>' +
  '<component :is="currentComp">' +
  '</component>' +
  '</keep-alive>' +
  '<button @click="change">switch</button>' +
  '</div>',
  data: {
    currentComp: 'A'
  },
  methods: {
    change() {
      this.currentComp = this.currentComp === 'A' ? 'B' : 'A'
    }
  },
  components: {
    A,
    B
  }
})
```

在上述代码中，我们定义了两个组件A和B并为其绑定了钩子函数，并且在根组件中用`<keep-alive>`组件包裹了一个动态组件，这个动态组件默认指向组件A，当点击switch按钮时，动态切换组件A和B。
第一次打开页面时，组件A被挂载，执行了组件A的mounted和activated钩子函数，当点击switch按钮后，组件A停止调用，同时组件B被挂载，此时执行了组件A的deactivated和组件B的mounted和activated钩子函数。此时再点击switch按钮，组件B停止调用，组件A被再次激活，我们发现现在只执行了组件A的activated钩子函数，这就验证了文档中所说的组件一旦被`<keep-alive>`缓存，那么再次渲染的时候就不会执行 created、mounted 等钩子函数。

## 总结
`keep-alive`组件是抽象组件，在对应父子关系时会跳过抽象组件，它只对包裹的子组件做处理，主要是根据LRU策略缓存组件VNode，最后在render时返回子组件的VNode。缓存渲染过程会更新keep-alive插槽，重新再render一次，从缓存中读取之前的组件VNode实现状态缓存。