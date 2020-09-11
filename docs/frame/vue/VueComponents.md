# Vue组件

## 属性

### 1.自定义属性props
prop 定义了这个组件有哪些可配置的属性，组件的核心功能也都是它来确定的。写通用组件时，props 最好用对象的写法，这样可以针对每个属性设置类型、默认值或自定义校验属性的值，这点在组件开发中很重要，然而很多人却忽视，直接使用 props 的数组用法，这样的组件往往是不严谨的。
``` js
// 父组件
 <props name='属性'
           :type='type'
           :is-visible="false"
           :on-change="handlePropChange"
           :list=[22,33,44]
           title="属性Demo"
           class="test1"
           :class="['test2']"
           :style="{ marginTop: '20px' }" //注意:style 的优先级是要高于 style
           style="margin-top: 10px">
  </props>

// 子组件
  props: {
    name: String,
    type: {
  //从父级传入的 type，它的值必须是指定的 'success', 'warning', 'danger'中的一个，如果传入这三个以外的值，都会抛出一条警告
      validator: (value) => {
        return ['success', 'warning', 'danger'].includes(value)
      }
    },
    onChange: {
    //对于接收的数据，可以是各种数据类型，同样也可以传递一个函数
      type: Function,
      default: () => { }
    },
    isVisible: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      // 对象或数组默认值必须从一个工厂函数获取
      default: () => []
    }
  }

```
从上面的例中，可以得出props 可以显示定义一个或一个以上的数据，对于接收的数据，可以是各种数据类型，**同样也可以传递一个函数。通过一般属性实现父向子通信；通过函数属性实现子向父通信**

### 2.inheritAttrs
这是2.4.0 新增的一个API  

详细:  
默认情况下父作用域的不被认作 props 的 attribute 绑定 (attribute bindings) 将会“回退”且作为普通的 HTML attribute 应用在子组件的根元素上。当撰写包裹一个目标元素或另一个组件的组件时，这可能不会总是符合预期行为。通过设置 inheritAttrs 到 false，这些默认行为将会被去掉。而通过 (同样是 2.4 新增的) 实例 property $attrs 可以让这些 attribute 生效，且可以通过 v-bind 显性的绑定到非根元素上。
没有声明的属性，默认自动挂载到组件根元素上，可通过设置inheritAttrs，去除

::: tip 注意：
这个选项不影响 class 和 style 绑定。
:::

### 3. data与props区别
- 相同点
  + 两者选项里都可以存放各种类型的数据，当行为操作改变时，所有行为操作所用到和模板所渲染的数据同时都会发生同步变化。
- 不同点
  + data 被称之为动态数据，在各自实例中，在任何情况下，我们都可以随意改变它的数据类型和数据结构，不会被任何环境所影响。
  + props 被称之为静态数据，在各自实例中，一旦在初始化被定义好类型时，基于 Vue 是单向数据流，在数据传递时始终不能改变它的数据类型，而且不允许在子组件中直接操作 传递过来的props数据，而是需要通过别的手段，改变传递源中的数据。至于如何改变，我们接下去详细介绍：

