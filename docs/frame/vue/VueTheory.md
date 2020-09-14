# Vue 原理解析

## Vue内置组件keep-alive内部原理

### keep-alive基本概念

`<keep-alive>`是Vue中内置的一个抽象组件，它自身不会渲染一个 DOM 元素，也不会出现在父组件链中。当它包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。

这句话的意思简单来说：就是我们可以把一些不常变动的组件或者需要缓存的组件用`<keep-alive>`包裹起来，这样`<keep-alive>`就会帮我们把组件保存在内存中，而不是直接的销毁，这样做可以保留组件的状态或避免多次重新渲染，以提高页面性能。

### 用法

#### `<keep-alive>`组件可接收三个属性：
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