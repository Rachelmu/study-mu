# Vue基础

## 灵活的 data，死板的 props
何为动态数据 data，何为静态数据 props   
### 相同点
- 两者选项里都可以存放各种类型的数据，当行为操作改变时，所有行为操作所用到和模板所渲染的数据同时都会发生同步变化。   

### 不同点
- Data 被称之为动态数据的原因，在各自实例中，在任何情况下，我们都可以随意改变它的数据类型和数据结构，不会被任何环境所影响。
- Props 被称之为静态数据的原因，在各自实例中，一旦在初始化被定义好类型时，基于 Vue 是单向数据流，在数据传递时始终不能改变它的数据类型。
- 更为关键地是，对数据单向流的理解，props的数据都是通过父组件或者更高层级的组件数据或者字面量的方式进行传递的，不允许直接操作改变各自实例中的props数据，而是需要通过别的手段，改变传递源中的数据。


### data 选项
当一个实例创建的时候，Vue会将其响应系统的数据放在data选项中，当这些属性的值发生改变时，视图将会产生“响应”，即匹配更新为新的值。初始定行的行为代码也都会随着响应系统进行一个映射。    

而 data 选项中的数据在实例中可以任意改变，不受任何影响，前提必须数据要跟逻辑相辅相成。    

在运行代码时候，data选项已经进入了Vue的响应系统里，model层(数据层)与view层(视图层)进行了对应的映射，任何数据类型都可以定义。

#### 总结：
- data 选项里的数据是灵活的
- 可以定义任何数据类型
- 也可以改变成任何数据类型
- 当数据变化时，视图和行为绑定的数据都会同步改变

### props
使用props传递数据作用域是孤立的，它是父组件通过模板传递而来，想接收到父组件传来的数据，需要通过props选项来进行接收。

子组件需要显示的声明接收父组件传递来的数据的数量，类型，初始值。

简单的接收可以通过数组的形式来进行接收。

#### 不可变的 props
在 data 选项中，当前实例（当前组件中改动）可以任意改变data选项里的数据，Vue传递数据时是基于数据单向流动，子组件不能改变当前实例中的 props 任何属性，需要通知父组件改变相应的值，重新改变。

### 字面量语法和动态语法

对于字面量语法和动态语法，初学者在父组件模板中向子组件中传递数据时加和不加 v-bind 有什么区别，同时会引起什么错语等问题会感觉迷惑。

#### 在子组件模板上传递数据时加 v-bind 意味着什么 ？
v-bind:msg = 'msg' 通过 v-bind 进行传递数据并且传递的数据并不是一个字面量，双引号里的解析的是一个表达式，同样也可以是实例上定义的数据和方法(其实就是引用一个变量）"。     
msg='11111' 没有 v-bind 的模式下只能传递一个字面量，这个字面量只限于 String 类量，字符串类型。    

注意：     
虽然通过字面量模式下，传任何类型都会被转成字符串类型，但是在子件接收的时候可以通过 typeof 去进行类型检测。

#### 字面量写法除了 String 类型
想通过字面量进行数据传递时，如果想传递非String类型，必须props名前要加上v-bind，内部通过实例寻找，如果实例方没有此属性和方法，则默认为对应的数据类型。   
``` js
:msg='11111'   //number
:msg='true'   //bootlean
:msg='()=>{console.log(1)}'//function
:msg='{a:1}'   //object
```

## Object.freeze
当一个 Vue 实例被创建时，它将 data 对象中的所有的 property 加入到 Vue 的响应式系统中。当这些 property 的值发生改变时，视图将会产生“响应”，即匹配更新为新的值。但是这个过程实际上是比较消耗性能的，所以对于一些有大量数据但只是展示的界面来说，并不需要将property加入到响应式系统中，这样可以提高渲染性能，怎么做呢，你需要了解一下Object.freeze。  

在Vue官网中，有这样一段话：这里唯一的例外是使用 Object.freeze()，这会阻止修改现有的   

property，也意味着响应系统无法再追踪变化。这段话的意思是，如果我们的数据使用了Object.freeze，就可以让数据脱离响应式系统，那么该如何做呢?
比如下面这个表格，因为只是渲染数据，这时候我们就可以通过Object.freeze来优化性能  

``` vue
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="日期" width="180" />
    <el-table-column prop="name" label="姓名" width="180" />
    <el-table-column prop="address" label="地址" />
  </el-table>
</template>
<script>
export default {
  data() {
    const data = Array(1000)
      .fill(1)
      .map((item, index) => {
        return {
          date: '2020-07-11',
          name: `子君${index}`,
          address: '大西安'
        }
      })
    return {
      // 在这里我们用了Object.freeze
      tableData: Object.freeze(data)
    }
  }
}
</script>

```

有的同学可能会有疑问，如果我这个表格的数据是滚动加载的，你这样写我不就没法再给tableData添加数据了吗？是，确实没办法去添加数据了，但还是有办法解决的，比如像下面这样

``` js
export default {
  data() {
    return {
      tableData: []
    }
  },
  created() {
    setInterval(() => {
      const data = Array(1000)
        .fill(1)
        .map((item, index) => {
          // 虽然不能冻结整个数组，但是可以冻结每一项数据
          return Object.freeze({
            date: '2020-07-11',
            name: `子君${index}`,
            address: '大西安'
          })
        })
      this.tableData = this.tableData.concat(data)
    }, 2000)
  }
}

```
合理的使用Object.freeze，是可以节省不少渲染性能，特别对于IE浏览器，效果还是很明显的，赶快去试试吧。

## filter

### 使用filter 简化逻辑

我想把时间戳显示成yyyy-MM-DD HH:mm:ss的格式怎么办？是需要在代码中先将日期格式化之后，再渲染到模板吗？就像下面这样。

``` vue
<template>
  <div>
    {{ dateStr }}
    <ul>
      <li v-for="(item, index) in getList" :key="index">
        {{ item.date }}
      </li>
    </ul>
  </div>
</template>
<script>
import { format } from '@/utils/date'
export default {
  data() {
    return {
      date: Date.now(),
      list: [
        {
          date: Date.now()
        }
      ]
    }
  },
  computed: {
    dateStr() {
      return format(this.date, 'yyyy-MM-DD HH:mm:ss')
    },
    getList() {
      return this.list.map(item => {
        return {
          ...item,
          date: format(item.date, 'yyyy-MM-DD HH:mm:ss')
        }
      })
    }
  }
}
</script>
```

像上面的写法，针对每一个日期字段都需要调用format，然后通过计算属性进行转换？这时候可以考虑使用Vue提供的filter去简化

``` vue
<template>
  <div>
    <!--使用过滤器-->
    {{ dateStr | formatDate }}
    <ul>
      <li v-for="(item, index) in list" :key="index">
        <!--在v-for中使用过滤器-->
        {{ item.date | formatDate }}
      </li>
    </ul>
  </div>
</template>
<script>
import { format } from '@/utils/date'
export default {
  filters: {
    formatDate(value) {
      return format(value, 'yyyy-MM-DD HH:mm:ss')
    }
  },
  data() {
    return {
      date: Date.now(),
      list: [
        {
          date: Date.now()
        }
      ]
    }
  }
}
</script>
```

通过上面的修改是不是就简单多了

### 注册全局filter

有些过滤器使用的很频繁，比如上面提到的日期过滤器，在很多地方都要使用，这时候如果在每一个要用到的组件里面都去定义一遍，就显得有些多余了，这时候就可以考虑Vue.filter注册全局过滤器。  

对于全局过滤器，一般建议在项目里面添加filters目录，然后在filters目录里面添加

``` js
// filters\index.js

import Vue from 'vue'
import { format } from '@/utils/date'

Vue.filter('formatDate', value => {
  return format(value, 'yyyy-MM-DD HH:mm:ss')
})
```

然后将filters里面的文件引入到main.js里面，这时候就可以在组件里面直接用了，比如将前面的代码可以修改为

``` vue
<template>
  <div>
    <!--使用过滤器-->
    {{ dateStr | formatDate }}
    <ul>
      <li v-for="(item, index) in list" :key="index">
        <!--在v-for中使用过滤器-->
        {{ item.date | formatDate }}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      date: Date.now(),
      list: [
        {
          date: Date.now()
        }
      ]
    }
  }
}
</script>
```

## use
在使用一些UI框架的时候，经常需要使用Vue.use来安装， 比如使用element-ui时候，经常会这样写:

``` js
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI,{size: 'small'});
```
使用了Vue.use之后，element-ui就可以直接在组件里面使用了。接下来我们实现一个简化版的element来看如何去安装。

### 了解Vue.use的用法
Vue.use是一个全局的方法，它需要在你调用 new Vue() 启动应用之前完成，Vue.use的参数如下
``` js
/**
* plugin: 要安装的插件 如 ElementUI
* options: 插件的配置信息 如 {size: 'small'}
*/
Vue.use(plugin, options)

```

### 模拟element-ui的安装逻辑
想一下，使用Vue.use(ElementUI,{size: 'small'}) 之后我们可以用到哪些element-ui提供的东西

1.可以直接在组件里面用element-ui的组件，不需要再import
2.可以直接使用v-loading
3.指令通过this.$loading在组件里面显示loading
4.其他...

``` js
// 这个是一个按钮组件
import Button from '@/components/button'

// loading 指令
import loadingDirective from '@/components/loading/directive'

// loading 方法
import loadingMethod from '@/components/loading'

export default {
  /**
   * Vue.use 需要插件提供一个install方法
   * @param {*} Vue Vue
   * @param {*} options 插件配置信息
   */
  install(Vue, options) {
    console.log(options)
    // 将组件通过Vue.components 进行注册
    Vue.components(Button.name, Button)

    // 注册全局指令
    Vue.directive('loading', loadingDirective)

    // 将loadingMethod 挂载到 Vue原型链上面，方便调用
    Vue.prototype.$loading = loadingMethod
  }
}
```

通过上面的代码，已经实现了一个丐版的element-ui插件，这时候就可以在main.js里面通过Vue.use进行插件安装了。大家可能会有疑问，为什么我要用这种写法，不用这种写法我照样可以实现功能啊。小编认为这种写法有两个优势

1.标准化，通过提供一种统一的开发模式，无论对插件开发者还是使用者来说，都有一个规范去遵循。  
2.插件缓存，Vue.use 在安装插件的时候，会对插件进行缓存，即一个插件如果安装多次，实际上只会在第一次安装时生效。

### 插件的应用场景
- 添加全局方法或者 property。
- 添加全局资源：指令/过滤器/过渡等。
- 通过全局混入来添加一些组件选项。
- 添加 Vue 实例方法，通过把它们添加到 Vue.prototype 上实现。
- 一个库，提供自己的 API，同时提供上面提到的一个或多个功能。如element-ui














