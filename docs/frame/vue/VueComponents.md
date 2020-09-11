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

### 4.单向数据流
这个概念出现在组件通信。props的数据都是通过父组件或者更高层级的组件数据或者字面量的方式进行传递的，不允许直接操作改变各自实例中的props数据，而是需要通过别的手段，改变传递源中的数据。那如果有时候我们想修改传递过来的prop,有哪些办法呢？

#### 方法1：过渡到 data 选项中
- 在子组件的 data 中拷贝一份 prop，data 是可以修改的
``` js
export default {
  props: {
    type: String
  },
  data () {
    return {
      currentType: this.type
    }
  }
}

```
- 在 data 选项里通过 currentType接收 props中type数据，相当于对 currentType= type进行一个赋值操作，不仅拿到了 currentType的数据，而且也可以改变 currentType数据。

#### 方法2：利用计算属性
``` js
export default {
  props: {
    type: String
  },
  computed: {
    normalizedType: function () {
      return this.type.toUpperCase();
    }
  }
}

```

以上两种方法虽可以在子组件间接修改props的值，但如果子组件想修改数据并且同步更新到父组件，却无济于事。在一些情况下，我们可能会需要对一个 prop 进行『双向绑定』，此时就推荐以下这两种方法：

#### 方法3：使用.sync
``` js
// 父组件
<template>
  <div class="hello">
    <div>
      <p>父组件msg：{{ msg }}</p>
      <p>父组件数组：{{ arr }}</p>
    </div>
    <button @click="show = true">打开model框</button>
    <br />
    <demo :show.sync="show" :msg.sync="msg" :arr="arr"></demo>
  </div>
</template>

<script>
import Demo from "./demo.vue";
export default {
  name: "Hello",
  components: {
    Demo
  },
  data() {
    return {
      show: false,
      msg: "模拟一个model框",
      arr: [1, 2, 3]
    };
  }
};
</script>

// 子组件
<template>
  <div v-if="show" class="border">
    <div>子组件msg：{{ msg }}</div>
    <div>子组件数组：{{ arr }}</div>
    <button @click="closeModel">关闭model框</button>
    <button @click="$emit('update:msg', '浪里行舟')">
      改变文字
    </button>
    <button @click="arr.push('前端工匠')">改变数组</button> 
  </div>
</template>
<script>
export default {
  props: {
    msg: {
      type: String
    },
    show: {
      type: Boolean
    },
    arr: {
      type: Array //在子组件中改变传递过来数组将会影响到父组件的状态
    }
  },
  methods: {
    closeModel() {
      this.$emit("update:show", false);
    }
  }
};

```
父组件向子组件 props 里传递了 msg 和 show 两个值，都用了.sync 修饰符，进行双向绑定。 不过.sync 虽好，但也有限制，比如：
::: warning 限制
1）不能和表达式一起使用（如v-bind:title.sync="doc.title + '!'"是无效的）；  
2）不能用在字面量对象上（如v-bind.sync="{ title: doc.title }"是无法正常工作的）。
:::

#### 方法4：将父组件中的数据包装成对象传递给子组件
- 这是因为在 JavaScript 中对象和数组是通过引用传入的，所以对于一个数组或对象类型的 prop 来说，在子组件中改变这个对象或数组本身将会影响到父组件的状态。比如上例中在子组件中修改父组件传递过来的数组arr,从而改变父组件的状态。

### 5.向子组件中传递数据时加和不加 v-bind？
对于字面量语法和动态语法，初学者可能在父组件模板中向子组件中传递数据时到底加和不加 v-bind 会感觉迷惑。
``` js
v-bind:msg = 'msg'
```

这是通过 v-bind 进行传递数据并且传递的数据并不是一个字面量，双引号里的解析的是一个表达式，同样也可以是实例上定义的数据和方法(其实就是引用一个变量）。
``` js
msg='浪里行舟'
```

这种在没有 v-bind 的模式下只能传递一个字面量，这个字面量只限于 String 类量，字符串类型。那如果想通过字面量进行数据传递时，如果想传递非String类型，必须props名前要加上v-bind，内部通过实例寻找，如果实例方没有此属性和方法，则默认为对应的数据类型。
。

``` js
:msg='11111' //Number 
:msg='true' //Bootlean 
:msg='()=>{console.log(1)}' //Function
:msg='{a:1}' //Object
```




