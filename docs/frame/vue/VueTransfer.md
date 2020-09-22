# Vue传值方式

## props

### props单向数据流

所有的 prop 都使得其父子 prop 之间形成了一个单向下行绑定：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。这样会防止从子组件意外变更父级组件的状态，从而导致你的应用的数据流向难以理解。

额外的，每次父级组件发生变更时，子组件中所有的 prop 都将会刷新为最新的值。这意味着你不应该在一个子组件内部改变 prop。如果你这样做了，Vue 会在浏览器的控制台中发出警告。

这里有两种常见的试图变更一个 prop 的情形：

1.这个 prop 用来传递一个初始值；这个子组件接下来希望将其作为一个本地的 prop 数据来使用。在这种情况下，最好定义一个本地的 data property 并将这个 prop 用作其初始值：
``` js
props: ['initialCounter'],
data: function () {
  return {
    counter: this.initialCounter
  }
}
```

2.这个 prop 以一种原始的值传入且需要进行转换。在这种情况下，最好使用这个 prop 的值来定义一个计算属性：
``` js
props: ['size'],
computed: {
  normalizedSize: function () {
    return this.size.trim().toLowerCase()
  }
}
```

::: warning 注意
注意在 JavaScript 中对象和数组是通过引用传入的，所以对于一个数组或对象类型的 prop 来说，在子组件中改变变更这个对象或数组本身将会影响到父组件的状态。
:::

### Prop 验证
我们可以为组件的 prop 指定验证要求，例如你知道的这些类型。如果有一个需求没有被满足，则 Vue 会在浏览器控制台中警告你。这在开发一个会被别人用到的组件时尤其有帮助。

- type:表示所传数据的类型

- required:true(表示该属性是必传)

- default: 'default' (提醒父组件并没有该属性传递)

- validator (自定义校验器，表示对传入属性的进行校验)


为了定制 prop 的验证方式，你可以为 props 中的值提供一个带有验证需求的对象，而不是一个字符串数组。例如：

``` js
Vue.component('my-component', {
  props: {
    // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
    propA: Number,
    // 多个可能的类型
    propB: [String, Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true
    },
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100
    },
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function () {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数
    propF: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    }
  }
})
```
当 prop 验证失败的时候，(开发环境构建版本的) Vue 将会产生一个控制台的警告。
::: warning 注意
注意那些 prop 会在一个组件实例创建之前进行验证，所以实例的 property (如 data、computed 等) 在 default 或 validator 函数中是不可用的。
:::


## provide与inject

### provide/inject基本介绍

provide/inject 是 Vue 在 2.2.0 版本新增的 API，官网介绍如下：

> 这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效。如果你熟悉 React，这与 React 的上下文特性很相似

官网的解释很让人疑惑，那我翻译下这几句话：

provide 可以在祖先组件中指定我们想要提供给后代组件的数据或方法，而在任何后代组件中，我们都可以使用 inject 来接收 provide 提供的数据或方法。

``` js
// 父级组件提供 'foo'
var Provider = {
  provide: {
    foo: 'bar'
  },
  // ...
}

// 子组件注入 'foo'
var Child = {
  inject: ['foo'],
  created () {
    console.log(this.foo) // => "bar"
  }
  // ...
}

```
### inject格式说明
除了上面代码中所使用的inject:['name']写法之外，inject还可以是一个对象。且可以指定默认值 

``` js
{
  inject: {
    customForm: {
      // 对于非原始值，和props一样，需要提供一个工厂方法
      default: () => ({
        size: 'default'
      })
    }
  }
}

// 如果我们希望inject进来的属性的名字不叫customForm,而是叫parentForm，如下代码
inject: {
    // 注入的属性名称
    parentForm: {
      // 通过 from 指定从哪个属性注入
      from: 'customForm',
      default: () => ({
        size: 'default'
      })
    }
  },
  computed: {
    // 通过计算组件获取组件的size, 如果当前组件传入，则使用当前组件的，否则是否form组件的
    getSize() {
      return this.size || this.parentForm.size
    }
  }

```

### 使用 provide/inject 做全局状态管理

在日常开发中，我们经常会使用 Vuex 做状态管理，但是，我个人一直不喜欢使用 Vuex，原因在于 Vuex   

为了保持状态可被回溯追踪，使用起来太过繁琐；而我之前参与的项目，较少多人合作，这个功能对于我来说，意义不大，我仅仅只需要 Vuex 中提供全局状态的功能。
那么，有没有方便快捷的实现全局状态的方法呢？当然有，这就是 provide/inject 这个黑科技 API 的一种使用方法。  

很多人也许会想到一种方式：在根组件中，传入变量，然后在后代组件中使用即可。

``` vue
// 根组件提供一个非响应式变量给后代组件
export default {
  provide () {
    return {
      text: 'bar'
    }
  }
}

// 后代组件注入 'app'
<template>
	<div>{{this.text}}</div>
</template>
<script>
  export default {
    inject: ['text'],
    created() {
      this.text = 'baz' // 在模板中，依然显示 'bar'
    }
  }
</script>

```
这个想法，说对也对，说不对也不对，原因在于 provide 的特殊性。  

在官网文档中关于 provide/inject 有这么一个提示：

::: tip
提示：provide 和 inject 绑定并不是可响应的。这是刻意为之的。然而，如果你传入了一个可监听的对象，那么其对象的属性还是可响应的。
:::

也就是说，Vue 不会对 provide 中的变量进行响应式处理。所以，要想 inject 接受的变量是响应式的，provide 提供的变量本身就需要是响应式的。
由于组件内部的各种状态就是可响应的，所以我们直接在根组件中将组件本身注入   

provide，此时，我们可以在后代组件中任意访问根组件中的所有状态，根组件就成为了全局状态的容器，仔细想想，是不是很像 React 中的 context 呢？

``` vue
// 根组件提供将自身提供给后代组件
export default {
  provide () {
    return {
      app: this
    }
  },
  data () {
    return {
      text: 'bar'
    }
  }
}

// 后代组件注入 'app'
<template>
	<div>{{this.app.text}}</div>
</template>
<script>
  export default {
    inject: ['app'],
    created() {
      this.app.text = 'baz' // 在模板中，显示 'baz'
    }
  }
</script>	

```

也许有的同学会问：使用 $root 依然能够取到根节点，那么我们何必使用 provide/inject 呢？ 

在实际开发中，一个项目常常有多人开发，每个人有可能需要不同的全局变量，如果所有人的全局变量都统一定义在根组件，势必会引起变量冲突等问题。  

使用 provide/inject 不同模块的入口组件传给各自的后代组件可以完美的解决该问题。  

### 使用限制
- provide和inject的绑定不是可响应式的。但是，如果你传入的是一个可监听的对象，如nameForm: this,那么其对象的属性还是可响应的。  

- Vue官网建议provide 和 inject 主要在开发高阶插件/组件库时使用。不推荐用于普通应用程序代码中。因为provide和inject在代码中是不可追溯的(ctrl + f可以搜)，建议可以使用Vuex代替。 但是，也不是说不能用，在局部功能有时候用了作用还是比较大的。


### 慎用 provide/inject
既然 provide/inject 如此好用，那么，为什么 Vue 官方还要推荐我们使用 Vuex，而不是用原生的 API 呢？ 

我在前面提到过，Vuex 和 provide/inject 最大的区别在于，Vuex 中的全局状态的每次修改是可以追踪回溯的，而 provide/inject 中变量的修改是无法控制的，换句话说，你不知道是哪个组件修改了这个全局状态。  

Vue 的设计理念借鉴了 React 中的单向数据流原则（虽然有 sync 这种破坏单向数据流的家伙），而 provide/inject 明显破坏了单向数据流原则。试想，如果有多个后代组件同时依赖于一个祖先组件提供的状态，那么只要有一个组件修改了该状态，那么所有组件都会受到影响。这一方面增加了耦合度，另一方面，使得数据变化不可控。如果在多人协作开发中，这将成为一个噩梦。  

在这里，我总结了两条条使用 provide/inject 做全局状态管理的原则：

1.多人协作时，做好作用域隔离  

2.尽量使用一次性数据作为全局状态

看起来，使用 provide/inject 做全局状态管理好像很危险，那么有没有 provide/inject 更好的使用方式呢？当然有，那就是使用 provide/inject 编写组件。 

### 使用 provide/inject 编写组件

使用 provide/inject 做组件开发，是 Vue 官方文档中提倡的一种做法。  

以我比较熟悉的 elementUI 来举例：  

在 elementUI 中有 Button（按钮）组件，当在 Form（表单）组件中使用时，它的尺寸会同时受到外层的 FormItem 组件以及更外层的 Form 组件中的 size 属性的影响。  

如果是常规方案，我们可以通过 props 从 Form 开始，一层层往下传递属性值。看起来只需要传递传递两层即可，还可以接受。但是，Form 的下一层组件不一定是 FormItem，FormItem 的下一层组件不一定是 Button，它们之间还可以嵌套其他组件，也就是说，层级关系不确定。如果使用 props，我们写的组件会出现强耦合的情况。  

provide/inject 可以完美的解决这个问题，只需要向后代注入组件本身（上下文），后代组件中可以无视层级任意访问祖先组件中的状态。
部分源码如下：

``` js
// Button 组件核心源码
export default {
    name: 'ElButton',
    // 通过 inject 获取 elForm 以及 elFormItem 这两个组件
    inject: {
        elForm: {
            default: ''
        },
        elFormItem: {
            default: ''
        }
    },
    // ...
    computed: {
        _elFormItemSize() {
            return (this.elFormItem || {}).elFormItemSize;
        },
        buttonSize() {
            return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
        },
        //...
    },
    // ...
};

```

### inject格式说明
使用的inject:['nameFrom']写法之外，inject还可以是一个对象。且可以指定默认值
nameFrom使用默认值
``` js
{
  inject: {
    nameFrom: {
      // 对于非原始值，和props一样，需要提供一个工厂方法
      default: () => ({
        size: 'default'
      })
    }
  }
}

// 如果我们希望inject进来的属性的名字不叫nameFrom,而是叫parentForm，如下代码
inject: {
    // 注入的属性名称
    parentForm: {
      // 通过 from 指定从哪个属性注入
      from: 'nameFrom',
      default: () => ({
        size: 'default'
      })
    }
  },
  computed: {
    // 通过计算组件获取组件的size, 如果当前组件传入，则使用当前组件的，否则是否form组件的
    getSize() {
      return this.size || this.parentForm.size
    }
  }

```


### 总结
其实在 Vue 的学习中，遵循着二八法则，我们常用的 20% 的 API 就能解决大部分日常问题，剩余的 API 感觉用处不大。但是，抽点时间去了解那些冷门的 API，也许你能发现一些不一般的风景，令你在解决一些问题时，事半功倍。

## dispatch 和 broadcast （vue2.0已经废用）
这是一种有历史的组件通信方式

> $dispatch与$broadcast是一种有历史的组件通信方式，为什么是有历史的，因为他们是Vue1.0提供的一种方式，在Vue2.0中废弃了。但是废弃了不代表我们不能自己手动实现，像许多UI库内部都有实现。本文以element-ui实现为基础进行介绍。同时看完本节，你会对组件的$parent,$children,$options有所了解。

### 方法介绍
- $dispatch: $dispatch会向上触发一个事件，同时传递要触发的祖先组件的名称与参数，当事件向上传递到对应的组件上时会触发组件上的事件侦听器，同时传播会停止。
- $broadcast: $broadcast会向所有的后代组件传播一个事件，同时传递要触发的后代组件的名称与参数，当事件传递到对应的后代组件时，会触发组件上的事件侦听器，同时传播会停止（因为向下传递是树形的，所以只会停止其中一个叶子分支的传递）。

### $dispatch实现与应用
1. 实现
``` js
/**
 * 向上传播事件
 * @param {*} eventName 事件名称
 * @param {*} componentName 接收事件的组件名称
 * @param {...any} params 传递的参数,可以有多个
 */
function dispatch(eventName, componentName, ...params) {
  // 如果没有$parent, 则取$root
  let parent = this.$parent || this.$root
  while (parent) {
    // 组件的name存储在组件的$options.componentName 上面
    const name = parent.$options.name
    // 如果接收事件的组件是当前组件
    if (name === componentName) {
      // 通过当前组件上面的$emit触发事件,同事传递事件名称与参数
      parent.$emit.apply(parent, [eventName, ...params])
      break
    } else {
      // 否则继续向上判断
      parent = parent.$parent
    }
  }
}

// 导出一个对象，然后在需要用到的地方通过混入添加
export default {
  methods: {
    $dispatch: dispatch
  }
}


```

2.应用 
在子组件中通过$dispatch向上触发事件
``` js
import emitter from '../mixins/emitter'
export default {
  name: 'Chart',
  // 通过混入将$dispatch加入进来
  mixins: [emitter],
   mounted() {
     // 在组件渲染完之后，将组件通过$dispatch将自己注册到Board组件上
    this.$dispatch('register', 'Board', this)
  }
}

```
在Board组件上通过$on监听要注册的事件
``` js
export default {
  name: 'Board',
  created() {
    this.$on('register',(component) => {
      // 处理注册逻辑
    })
  }
}

```

### $broadcast实现与应用
1. 实现
``` js

/**
 * 向下传播事件
 * @param {*} eventName 事件名称
 * @param {*} componentName 要触发组件的名称
 * @param  {...any} params 传递的参数
 */
function broadcast(eventName, componentName, ...params) {
  this.$children.forEach(child => {
    const name = child.$options.name
    if (name === componentName) {
      child.$emit.apply(child, [eventName, ...params])
    } else {
      broadcast.apply(child, [eventName, componentName, ...params])
    }
  })
}

// 导出一个对象，然后在需要用到的地方通过混入添加
export default {
  methods: {
    $broadcast: broadcast
  }
}

```

2.应用 
在父组件中通过$broadcast向下触发事件
``` js
import emitter from '../mixins/emitter'
export default {
  name: 'Board',
  // 通过混入将$dispatch加入进来
  mixins: [emitter],
  methods:{
  	//在需要的时候，刷新组件
  	$_refreshChildren(params) {
  		this.$broadcast('refresh', 'Chart', params)
  	}
  }
}
```

在后代组件中通过$on监听刷新事件
``` js
export default {
  name: 'Chart',
  created() {
    this.$on('refresh',(params) => {
      // 刷新事件
    })
  }
}
```
### 总结
通过上面的例子，同学们应该都能对$dispatch和$broadcast有所了解，但是为什么Vue2.0要放弃这两个方法呢？官方给出的解释是：”因为基于组件树结构的事件流方式实在是让人难以理解，并且在组件结构扩展的过程中会变得越来越脆弱。这种事件方式确实不太好，我们也不希望在以后让开发者们太痛苦。并且 $dispatch 和 $broadcast 也没有解决兄弟组件间的通信问题