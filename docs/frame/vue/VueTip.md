# Vue小技巧

## 使用require.context实现前端工程自动化

require.context是一个webpack提供的Api,通过执行require.context函数获取一个特定的上下文,主要是用于实现自动化导入模块。  

什么时候用？ 当一个js里面需要手动引入过多的其他文件夹里面的文件时，就可以使用。  

在Vue项目开发过程中，我们可能会遇到这些可能会用到require.context的场景  

1.当我们路由页面比较多的时候，可能会将路由文件拆分成多个，然后再通过import引入到index.js路由主入口文件中  

2.当使用svg symbol时候，需要将所有的svg图片导入到系统中（建议使用svg-sprite-loader）  

3.开发了一系列基础组件，然后把所有组件都导入到index.js中，然后再放入一个数组中，通过遍历数组将所有组件进行安装。


对于上述的几个场景，如果我们需要导入的文件比较少的情况下，通过import一个一个去导入还可以接受，但对于量比较大的情况，就变成了纯体力活，而且每次修改增加都需要在主入口文件内进行调整。这时候我们就可以通过require.context去简化这个过程。  

现在以上述第三条为例,来说明require.context的用法

关键性方法require.context主要流程是:读取要注册为全局组件的文件路径->循环进行动态注册

``` js
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";
Vue.config.productionTip = false;
const requireComponent = require.context(
  // 其组件目录的相对路径
  "./common",
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /Base[A-Z]\w+\.(vue|js)$/
);

// context.keys()返回所有匹配到的文件路径
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName);
  const componentName = upperFirst(
    camelCase(
      fileName
        .split("/")
        .pop()
        .replace(/\.\w+$/, "")
    )
  );
  // 通过context(key)可以获取到对应的文件。	.default表示export defeult导出的内容
  Vue.component(componentName, componentConfig.default || componentConfig);
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
```
基础组件使用Base开头进行命名,所以require.context的筛选正则才可以这样写 Base[A-Z]\w+\.(vue|js)$/这样以后只要我们在common文件夹下以Base开头的文件都会自动注册为全局组件


## 自定义v-model
在用Vue开发前端时，不论使用原生还是封装好的UI库，对于表单组件，一般都会使用到v-model。虽然v-model是一个语法糖，但是吃到嘴里挺甜的啊。学会自定义v-model，还是很有必要的。

### 基本用法
一个组件上的v-model默认是通过在组件上面定义一个名为value的props,同时对外暴露一个名为input的事件。
``` vue
<template>
  <div class="custom-input">
    <input :value="value" @change="$_handleChange">
  </div>
</template>
<script>
export default {
  props: {
    // 定义一个名为value的属性
    value: {
      type: String,
      default: "",
    }
  },
  methods:{
    $_handleChange(e){
      // 对外暴露一个input事件
      this.$emit("input", e.target.value)
    }
  }
}
</script>

// 使用方法
<custom-input v-model="text"></custom-input>
```

### 自定义属性与事件
通常情况下，使用value属性与input事件没有问题，但是有时候有些组件会将value属性或input事件用于不同的目的，比如对于单选框、复选框等类型的表单组件的value属性就有其他用处，[参考](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#Value)。或者希望属性名称或事件名称与实际行为更贴切，比如active,checked等属性名。
``` vue
<template>
  <!-- 开关组件，通过样式控制开关组件的状态 -->
  <div
    :class="['custom-switch', active && 'custom-swithc__acitive']"
    @click="$_handleClick"
  >
    <!-- 开关组件内部的开关 -->
    <span class="custom-switch__core"></span>
  </div>
</template>
<script>
export default {
  // 通过model 可以自定义 属性和 事件名
  model: {
    event: "change",
    prop: "active"
  },
  props: {
    // 定义一个名为active的属性
    active: {
      type: Boolean,
      default: false,
    }
  },
  methods:{
    $_handleClick(e){
      // 对外暴露一个input事件
      this.$emit("change", !this.active)
    }
  }
}
</script>
```



