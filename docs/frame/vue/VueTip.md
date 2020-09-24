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

