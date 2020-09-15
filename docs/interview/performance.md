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


## 说一下 Webpack 的热更新原理吧

## Sourcemap 是什么？有什么作用？生产环境中应该怎么用？
##