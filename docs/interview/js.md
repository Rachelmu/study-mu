# js基础面试题
## 数据类型

### JS判断数组的5种方式

+  instanceof

  ```
   arr isntanceof Array
  ```

+ __proto__

  ```
   arr.__proto__  === Array.prototype
  ```

+ constructor

  ```
  arr.constructor === Array
  ```

+ Object.prototype.toString

  ```
  // 过object类型的副属性class去判断的，其中函数的class是Function，结果是[object Function]， 普通的对象是Object，结果是[object Object]
  Object.prototype.toString.call(arr) === '[object Array]'
  ```

+ Array.isArray

  ```
  // es6新增的方法
  Array.isArray(arr)
  ```

### 手写instanceof及原理

+ **`instanceof`** **运算符**用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链

+ instanceof的原理是基于原型链的查询，只要处于原型链中，判断永远为true

  ```
  const Person = function() {}
  const p1 = new Person()
  p1 instanceof Person // true
  
  var str1 = 'hello world'
  str1 instanceof String // false
  
  var str2 = new String('hello world')
  str2 instanceof String // true
  
  // 判断基本数据类型
  // 其实就是自定义instanceof行为的一种方式，这里将原有的instanceof方法重定义，换成了typeof，因此能够判断基本数据类型。
  class PrimitiveNumber {
    static [Symbol.hasInstance](x) {
      return typeof x === 'number'
    }
  }
  console.log(111 instanceof PrimitiveNumber) // true
  ```

## 闭包

### 怎么理解闭包

+ 基础中的基础，虽然社招考得不多，但是如果连闭包都理解不了，应该会减分不少。闭包由于在规范里没有定义，所以很多人下的定义不一样，理解的角度也不同，但是自己要有一套正确的理解方式，如果按照我的理解 JavaScript 里面所有的函数都是闭包，因为有全局环境，所有的函数都可以访问全局变量。

### 节流和防抖的实现

+ 防抖和节流的代码还是需要会手写的，这也是一个闭包的例子，

## 异步

### 用setTimeout实现setInterval

```
function mySetInterval(fn, millisec,count){
  function interval(){
    if(typeof count===‘undefined’||count-->0){
      setTimeout(interval, millisec);
      try{
        fn()
      }catch(e){
        count = 0;
        throw e.toString();
      }
    }
  }
  setTimeout(interval, millisec)
}
```

+ 这个`mySetInterval`函数有一个叫做`interval`的内部函数，它通过`setTimeout`来自动被调用，在`interval`中有一个闭包，调用了回调函数并通过`setTimeout`再次调用了`interval`。

+ 增加一个额外的参数用来标明代码执行的次数

  

### 实现原生ajax

## 原生js问题

### for in 和 for of的区别详解以及为for in的输出顺序

+ 都是用来遍历属性

  ```
  // 例1 遍历对象
  const obj = {
          a: 1,
          b: 2,
          c: 3
      }
  for (let i in obj) {
      console.log(i)
      // a
      // b
      // c
  }
  for (let i of obj) {
      console.log(i)
      // Uncaught TypeError: obj is not iterable 报错了
  }
  // 例2 遍历数组
  const arr = ['a', 'b', 'c']
      // for in 循环
  for (let i in arr) {
      console.log(i)
      // 0
      // 1
      // 2
  }
  
  // for of
  for (let i of arr) {
      console.log(i)
      // a
      // b
      // c
  }
  // 例3
  const arr = ['a', 'b']
  // 手动给 arr数组添加一个属性
  arr.name = 'qiqingfu'
  
  // for in 循环可以遍历出 name 这个键名
  for (let i in arr) {
      console.log(i)
      // a
      // b
      // name
  }
  ```

  

+ for in的特点
  + for ... in 循环返回的值都是数据结构的 键值名。
  + 遍历对象返回的对象的key值,遍历数组返回的数组的下标(key)。
  + for ... in 循环不仅可以遍历数字键名,还会遍历原型上的值和手动添加的其他键。如——例3
  + 特别情况下, for ... in 循环会以看起来任意的顺序遍历键名
  + **总结一句: for in 循环特别适合遍历对象。**

+ for of的特点
  + for of 循环用来获取一对键值对中的值,而 for in 获取的是 键名
  + 一个数据结构只要部署了 **Symbol.iterator** 属性, 就被视为具有 iterator接口, 就可以使用 for of循环。
  + 例1这个对象,没有 Symbol.iterator这个属性,所以使用 for of会报 obj is not iterable
  + for of 不同与 forEach, 它可以与 break、continue和return 配合使用,也就是说 for of 循环可以随时退出循环。
  + 提供了遍历所有数据结构的统一接口

+ 部署了Symbol。iterator属性的数据结构
  + 只要有 iterator 接口的数据结构,都可以使用 for of循环。
    - 数组 Array
    - Map
    - Set
    - String
    - arguments对象
    - Nodelist对象, 就是获取的dom列表集合

+ 以上这些都可以直接使用 for of 循环。凡是部署了 iterator 接口的数据结构也都可以使用数组的 扩展运算符(...)、和解构赋值等操作。

+ 让对象可以使用for of循环

  + 使用 Object.keys() 获取对象的 key值集合后,再使用 for of

    ```
     const obj = {
            a: 1,
            b: 2,
            c: 3
        }
    
        for (let i of Object.keys(obj)) {
            console.log(i)
            // 1
            // 2
            // 3
        }
    ```

# ES6

### let var const 有什么区别



### 原型，class B 继承 class A 翻译成 es5 应该是什么样子

+ 说实话，我觉得这道题其实蛮有水平的，即考察了如何写出一个好的继承方式，也对 new 过程进行了考察，还对考察了对 Class 的理解。
+ 注意的点：`class` 是有重载功能的，怎么在子类的构造函数里面调用 `super`

## Promise

### 手写Promise

### 手写Promise.all

### 写一个 promise 重试函数，可以设置时间间隔和次数。`function foo(fn, interval, times) {}`



# DOM

1. cookie有哪些属性
2. cookie,session,localstorage,sessionstorage有什么区别
3. 怎么禁止js访问cookie

# 网络

1. 简述https原理，以及与http的区别
2. 操作系统中进程和线程怎么通信
3. 你知道哪些http头部
4. 怎么与服务端保持连接
5. http请求跨域问题，你都知道哪些解决跨域的方法
6. 你了解哪些请求方法，分别有哪些作用和不同
7. 浏览器缓存
8. jsonp实现一下跨域
9. 你知道哪些状态码
10. options请求方法有什么用

## 浏览器缓存

+ 浏览器缓存分为**强缓存**和**协商缓存**，强缓存会直接从浏览器里面拿数据，协商缓存会先访问服务器看缓存是否过期，再决定是否从浏览器里面拿数据。
+ 控制强缓存的字段有：Expires 和 Cache-Control，Expires 和 Cache-Control。
+ 控制协商缓存的字段是：Last-Modified / If-Modified-Since 和 Etag / If-None-Match，其中 Etag / If-None-Match 的优先级比 Last-Modified / If-Modified-Since 高。

# VUE

1. vue-router源码
2. vue原理（手写代码，实现数据劫持）
3. Object.defineProperty除了set get外还有什么属性，我回答了configurable enumerable

## 有用 ssr 



# React

+ [https://react.iamkasong.com/#%E7%AB%A0%E8%8A%82%E8%AF%B4%E6%98%8E](https://react.iamkasong.com/#章节说明)

## react 的基本原理

+ UI = f(state) ，虚拟 DOM、diff 策略、setState

## Rreact事件机制

+ 一文吃透 React 事件机制原理: *https://toutiao.io/posts/28of14w/preview*
+ React 为什么要用合成事件
+ 事件机制：注册和分发的过程。这里面至少要说出事件注册都是在元素的最顶层 `document` 节点上。

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

# 算法

1. 算法：实现36进制转换
2. 树的遍历有几种方式，实现下层次遍历
3. 判断对称二叉树
4. 合并乱序区间
5. 算法题：老师分饼干，每个孩子只能得到一块饼干，但每个孩子想要的饼干大小不尽相同。目标是尽量让更多的孩子满意。如孩子的要求是 1, 3, 5, 4, 2，饼干是1, 1，最多能让1个孩子满足。如孩子的要求是 10, 9, 8, 7, 6，饼干是7, 6, 5，最多能让2个孩子满足。
6. 算法题：给定一个正整数数列a, 对于其每个区间, 我们都可以计算一个X值;X值的定义如下: 对于任意区间, 其X值等于区间内最小的那个数乘上区间内所有数和;现在需要你找出数列a的所有区间中, X值最大的那个区间;如数列a为: 3 1 6 4 5 2; 则X值最大的区间为6, 4, 5, X = 4 * (6+4+5) = 60;
7. 算法题：两个有序链表和并成一个有序链表

### 怎么判断单链表相交。

+ 很多种方法，我当时说的是最后一个节点如果相同，那么就代表相交。

### 怎么找到第一个相交的节点

+ 同时遍历两个链表到尾部，同时记录两个链表的长度。若两个链表最后的一个节点相同，则两个链表相交。有两个链表的长度后，我们就可以知道哪个链表长，设较长的链表长度为 len1,短的链表长度为 len2。则先让较长的链表向后移动(len1-len2)个长度。然后开始从当前位置同时遍历两个链表，当遍历到的链表的节点相同时，则这个节点就是第一个相交的节点。
+ 这是我刚想到的一种方式，不过当时面试的时候我记得好像更简单，但是想不起来了。

### 求最大公共前缀

+ 如 `['aaafsd', 'aawwewer', 'aaddfff'] => 'aa'`

# 模块化

## import 和 require 导入的区别

+ 高频题，考察 ES6 模块和 CommonJS 模块 的区别。关键点：1. 前者是值的引用，后者是值的拷贝。2.前者编译时输出接口，后者运行时加载。

+ 推荐文章：**前端模块化：CommonJS,AMD,CMD,ES6**[4]

+ 前端模块化：CommonJS,AMD,CMD,ES6: *https://juejin.im/post/5aaa37c8f265da23945f365c*

  

### require 有什么性能问题

## 组件库如何做按需加载

+ 我常用的是`babel-plugin-import`
+ 

# 工程化

1. webpack怎么优化
2. happypack和treeshaking作用
3. 项目优化
4. 你做的项目有什么值得说的

## Webpack

### webpack 如何实现动态加载

+ 讲道理 webpack 动态加载就两种方式：`import()`和 `require.ensure`，不过他们实现原理是相同的。
+ 我觉得这道题的重点在于动态的创建 script 标签，以及通过 `jsonp` 去请求 **chunk**，推荐的文章是：**webpack 是如何实现动态导入的**[5]
+ webpack 是如何实现动态导入的: *https://juejin.im/post/5d26e7d1518825290726f67a*

### webpack 能动态加载 require 引入的模块吗？

+ 应该是不能的，前面说了，webpack 支持动态导入基本上只能用`import()` 和`require.ensure`。

### require 引入的模块 webpack 能做 Tree Shaking 吗？

+ 不能，Tree Shaking 需要静态分析，只有 ES6 的模块才支持。

# 性能优化

## 简历里面的性能优化是如何做的

+ 减少请求频率、图片压缩、`React.memo`、`React.useMemo`

  

## 框架性能优化

### 如何优化SPA应用的首屏加载速度慢的问题

- 将公用的JS库通过script标签外部引入，减小app.bundel的大小，让浏览器并行下载资源文件，提高下载速度；
- 在配置 路由时，页面和组件使用懒加载的方式引入，进一步缩小 app.bundel 的体积，在调用某个组件时再加载对应的js文件；
- 加一个首屏 loading 图，提升用户体验；
- 如果在webview中的页面，可以进行页面预加载
- 独立打包异步组件公共 Bundle，以提高复用性&缓存命中率
- 静态文件本地缓存，有两种方式分别为HTTP缓存，设置Cache-Control，Last-Modified，Etag等响应头和Service Worker离线缓存
- 配合 PWA 使用
- SSR
- root中插入loading 或者 骨架屏 prerender-spa-plugin
- 去掉外链css
- http缓存资源 cache-control > expires > etag > last-modified
- 使用动态 polyfill
- 使用 SplitChunksPlugin 自动拆分业务基础库，避免加载重复模块
- 使用 Tree Shaking 减少业务代码体积
- 懒加载：动态import，loaddable
- 把代码编译到 ES2015+
- 使用 lazyload 和 placeholder 提升加载体验

## class 组件里面如何做性能优化(因为前面我说了用 React.memo 做了性能优化)

+ shouldComponentUpdate(简称 SCU)。SCU 跟 immutable 强相关，一定要好好理解 react 的 immutable，否则很可能理解不了为什么不能直接去修改 state，然后再去 setState，以及 redux 的 reducer 要返回一个新的对象。

# Node

1. node中cluster是怎样开启多进程的，并且一个端口可以被多个进程监听吗
2. 你了解node多进程吗
3. node进程中怎么通信
4. node可以开启多线程吗

# typescript

1. 你觉得typescript和javascript有什么区别
2. typescript你都用过哪些类型
3. typescript中type和interface的区别
4. Ts 有什么优势- 讲道理所有现在在网上能查到的优势都是得益于**静态语言**的优势。

### 实现一个 Typescript 里的 Pick

+ type Pick<T, K extends keyof T> = { [P in K]: T[P] }

### type 和 interface 的区别

+ 这是一个高频题，如果考察 TS，这应该是最容易考察的，网上也都能查到相关的资料，但是很可能忽略一个点：**type 只是一个类型别名，并不会产生类型**。所以其实 type 和 interface 其实不是同一个概念，其实他们俩不应该用来比较的，只是有时候用起来看着类似。

###  ts 实现一个 redux



# 笔试题

```
const a = { b: 3}

function foo(obj) {
  obj.b = 5

  return obj
}

const aa = foo(a)

console.log(a.b)	// 5

console.log(aa.b) // 5
```

```
function Ofo() {}

function Bick() {
	this.name = 'mybick'
}

var myBick = new Ofo()

Ofo.prototype = new Bick()

var youbick = new Bick()

console.log(myBick.name)

console.log(youbick.name)
```

### 实现一个 fill 函数，不能用循环。

+ 考察递归

### 用 ES5 实现私有变量

+ 考察闭包的使用

### 手写：并发只能10个







**考虑过 Vue.js、React 这类的框架为什么要用 Virtual DOM 机制吗？**

1、React / Vue.js 之类的框架为什么需要给组件添加 key 属性，其作用是什么？

2、如何判断当前代码是运行在浏览器还是 Node.js 环境中？

3、Sourcemap 是什么？有什么作用？生产环境中应该怎么用？

4、说一下 Webpack 的热更新原理吧

5、简要描述一下什么是消息队列，宏任务和微任务分别又是怎么回事