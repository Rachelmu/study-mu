# React

+ [https://react.iamkasong.com/#%E7%AB%A0%E8%8A%82%E8%AF%B4%E6%98%8E](https://react.iamkasong.com/#章节说明)

## react 的基本原理

+ UI = f(state) ，虚拟 DOM、diff 策略、setState

## Rreact事件机制

+ 一文吃透 React 事件机制原理: *https://toutiao.io/posts/28of14w/preview*
+ React 为什么要用合成事件
+ 事件机制：注册和分发的过程。这里面至少要说出事件注册都是在元素的最顶层 `document` 节点上。

## React/Vue为什么要在列表组件中写key,作用是什么？

- key是给每一个vnode(虚拟dom)的唯一id,可以依靠 key ，更**准确**，更**快**的拿到oldVnode中对应的vnode节点。

- **更准确**

  因为有key的存在，避免了就地复用，a.key === b.key的对比中，避免了就地复用情况。

- **更快**

  利用key的唯一=key的作用是为了在diff算法执行时更快的找到对应的节点，提高diff速度。



## 聊聊 React 的 diff

聊 diff 建议先看看我之前写过的一篇关于虚拟 DOM 的文章：[从 React 历史的长河里聊虚拟 DOM 及其价值](https://mp.weixin.qq.com/s?__biz=MzI1ODk2Mjk0Nw==&mid=2247484879&idx=1&sn=ee0d2e3e235fa911ce2878ae2ea2b676&scene=21#wechat_redirect)，有助于理解 diff 的意义。

diff 的细节可以看我之前写的：[详解 React 16 的 Diff 策略](https://mp.weixin.qq.com/s?__biz=MzI1ODk2Mjk0Nw==&mid=2247484536&idx=1&sn=94777b8c1aab80dffe1fc224bec02c72&scene=21#wechat_redirect)



## React 优化

可以看之前我写的 [React 函数式组件性能优化指南](https://mp.weixin.qq.com/s?__biz=MzI1ODk2Mjk0Nw==&mid=2247484774&idx=1&sn=9dc58e54a28755504d58bef49a78f3b4&scene=21#wechat_redirect)，对于类组件也有对应的 API。



## 聊一聊 React 的生命周期

+ 尽量把 React 15 和 16 的进行对比，然后 16 为什么要准备废除那几个生命周期，以及新增的生命周期可以进行替代。
+ 这个图好好的理解一下![640](/Users/mumu/Documents/webExercise/640.jpeg)



### react 16 生命周期有什么改变

```
componentWillMount`，`componentWillReceiveProps`，`componentWillUpdate`准备废除，新增了 `static getDerivedStateFromProps` 和 `getSnapshotBeforeUpdate
```

我还详细的介绍了为什么要用 `getDerivedStateFromProps` 来代替即将废除的三个生命周期，主要是 16 版本 render 之前的生命周期可能会被多次执行，具体的可看我的这篇文章：[Deep In React 之浅谈 React Fiber 架构(一)](https://mp.weixin.qq.com/s?__biz=MzI1ODk2Mjk0Nw==&mid=2247484469&idx=1&sn=f68d044f1b0e4e2eb981e3878427b75b&scene=21#wechat_redirect)

### getDerivedStateFromProps



## 聊一聊 hooks 怎么处理生命周期

+ 讲道理函数式组件是没有生命周期的，但是如何去模拟类组件的生命周期的作用，都是在 `useEffect` 里面进行操作的，因为生命周期里面所做的基本都是副作用，放到 `useEffect` 里是最合适的，专门用来处理副作用。



## 那你聊聊 React 的源码，把你记得起的讲一讲

> 我看过 React 的一部分源码的，所以关于 React 源码更新部分的东西，应该基本都能说个大概。

- FiberNode 有哪些属性
- stadeNode 有什么用？



## react基础问题

### react 里有动态加载的 api 吗？

+ React.lazy

### React.lazy原理



## redux 的重点概念

+ store、reduce、action、actionCreater、dispatch
+ 状态管理常用的是 redux 和 dva，然后再聊了聊区别已经 redux 的理念

### 实现一个 redux

+ 实现 `createStore` 的功能，关键点发布订阅的功能，以及取消订阅的功能。

## class 组件与函数式组件的区别

+ 生命周期、设计理念，感觉这道题比较开发，可以看看 dan 的这篇：**函数式组件与类组件有何不同？**[3]
+ 函数式组件与类组件有何不同？: *https://overreacted.io/zh-hans/how-are-function-components-different-from-classes/*
