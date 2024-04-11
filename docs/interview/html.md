### Html 面试题

```
https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/HTML5
```

## 语义化标签类

+ 什么是标签语义化
  + 合理的标签干合适的事情
+ 优点
  + 让人更容易读懂（增加代码可读性）
  + 让搜索引擎更容易读懂（SEO）

+ 都有哪些标签，都是啥意思
  + 块级（display：block/table）：div 、p、h1~h6、hr、ul、ol、li、dl、dd、form、table、header、footer、main、nav、sector、arcitcle、pre、table、tbody、thead、th、tr、tfoot
  + 行级（display：inline/inline-block）：a、span、small、strong、em、i、code、img、input、button
  + 行内块（display：inline-block）：img、input


+ **区别**：
  + 1.行内元素与块级函数可以相互转换，通过修改display属性值来切换块级元素和行内元素，行内元素display：inline，块级元素display：block。
  + 2.行内元素和其他行内元素都会在一条水平线上排列，都是在同一行的；块级元素却总是会在新的一行开始排列，各个块级元素独占一行，垂直向下排列，若想使其水平方向排序，可使用左右浮动（float：left/right）让其水平方向排列。
  + 3.行内元素不可以设置宽高，宽度高度随文本内容的变化而变化，但是可以设置行高（line-height），同时在设置外边距margin上下无效，左右有效，内填充padding上下无效，左右有效；块级元素可以设置宽高，并且宽度高度以及外边距，内填充都可随意控制。
  + 4.块级元素可以包含行内元素和块级元素，还可以容纳[内联元素](https://www.baidu.com/s?wd=内联元素&tn=SE_PcZhidaonwhc_ngpagmjz&rsv_dl=gh_pc_zhidao)和其他元素；行内元素不能包含块级元素，只能容纳文本或者其他行内元素。

+ 如何转换
  + display还有none（隐藏dom）、flex（弹性）、table（表）

+ diplay的值都有啥
  + display：none和visibility：hidden、ocpacity：0（兼容用fliter
  + filter滤镜：对比度、饱和度、阴影、色相、透明度
+ display:none
  + 让元素如何隐藏，你可以怎么做？
  + display:none和visibility:hidden的区别
  + opacity的兼容处理
  + filter还能做哪些事情

+ display：flex 响应式、兼容性
  + 项目中你什么时候用到了flex
  + 除了这种方式能居中还有哪些
  + 响应式布局还可以怎么做
  + 都有哪些盒子模型

## Reflow和Repaint

- Reflow：当涉及到DOM节点的布局属性发生变化时，就会重新计算该属性，浏览器会重新描绘相应的元素，此过程叫Reflow（回流或重排）。
- Repaint：当影响DOM元素可见性的属性发生变化 (如 color) 时, 浏览器会重新描绘相应的元素, 此过程称为Repaint（重绘）。因此重排必然会引起重绘。
- 引起重排和重绘的操作
  - 调整窗口大小
  - 字体大下改变
  - 样式表变动
  - 元素内容变化，尤其是输入控件
  - CSS伪类激活，在用户交互过程中发生
  - DOM操作，DOM元素增删、修改
  - width, clientWidth, scrollTop等布局宽高的计算
- 优化建议
  - 避免逐条更改样式。建议集中修改样式，例如操作className。
  - 避免频繁操作DOM。创建一个documentFragment或div，在它上面应用所有DOM操作，最后添加到文档里。设置display:none的元素上操作，最后显示出来。
  - 避免频繁读取元素几何属性（例如scrollTop）。绝对定位具有复杂动画的元素。
  - 绝对定位使它脱离文档流，避免引起父元素及后续元素大量的回流
### href和src的区别

- **href**：href标识超文本引用，用在link和a等元素上，href是引用和页面关联，是在当前元素和引用资源之间建立联系。若在文档中添加href ，浏览器会识别该文档为 CSS 文件，就会并行下载资源并且不会停止对当前文档的处理。这也是为什么建议使用 link 方式加载 CSS，而不是使用 @import 方式。
- **src**：src表示引用资源，替换当前元素，用在img，script，iframe上，src是页面内容不可缺少的一部分。
  当浏览器解析到src ，会暂停其他资源的下载和处理（图片不会暂停其他资源下载和处理），直到将该资源加载、编译、执行完毕，图片和框架等也如此，类似于将所指向资源应用到当前内容。这也是为什么建议把 js 脚本放在底部而不是头部的原因。

## 浏览器的渲染过程

1. 解析HTML文本并构建DOM tree
2. 解析CSS样式表并构建CSSOM tree
3. 根据DOM tree 和 CSSOM tree 构建 Render tree
4. 根据Render tree信息进行布局处理（Layout）
5. 对页面元素进行绘制（Painting）

## 从输入 URL 到页面加载完成的过程中都发生了什么？

1. 键盘或触屏输入URL并回车确认
2. URL解析/DNS解析查找域名IP地址
3. 网络连接发起HTTP请求
4. HTTP报文传输过程
5. 服务器接收数据
6. 服务器响应请求/MVC
7. 服务器返回数据
8. 客户端接收数据
9. 浏览器加载/渲染页面
10. 打印绘制输出

## doctype有什么作用

- doctype是一种标准通用标记语言的文档类型声明，目的是告诉标准通用标记语言解析器要使用什么样的文档类型定义（DTD）来解析文档。

  声明是用来指示web浏览器关于页面使用哪个HTML版本进行编写的指令。 声明必须是HTML文档的第一行，位于html标签之前。

  浏览器本身分为两种模式，一种是标准模式，一种是怪异模式，浏览器通过doctype来区分这两种模式，doctype在html中的作用就是触发浏览器的标准模式，如果html中省略了doctype，浏览器就会进入到Quirks模式的怪异状态，在这种模式下，有些样式会和标准模式存在差异，而html标准和dom标准值规定了标准模式下的行为，没有对怪异模式做出规定，因此不同浏览器在怪异模式下的处理也是不同的，所以一定要在html开头使用doctype。

## iframe框架有那些优缺点

**优点：**

- iframe能够原封不动的把嵌入的网页展现出来。
- 如果有多个网页引用iframe，那么你只需要修改iframe的内容，就可以实现调用的每一个页面内容的更改，方便快捷。
- 网页如果为了统一风格，头部和版本都是一样的，就可以写成一个页面，用iframe来嵌套，可以增加代码的可重用。
- 如果遇到加载缓慢的第三方内容如图标和广告，这些问题可以由iframe来解决。

**缺点：**

- 搜索引擎的爬虫程序无法解读这种页面
- 框架结构中出现各种滚动条
- 使用框架结构时，保证设置正确的导航链接。
- iframe页面会增加服务器的http请求

## label标签的作用

- 通常是写在表单内，它关联一个控件，使用 `label` 可以实现点击文字选取对应的控件。

  ```html
  <input type="checkbox" id="test">
  <label for="test" >test</label>
  ```

## 关闭form自动完成功能

- 设置 `autocomplete=off`

## 设计一个 input 组件需要哪些属性

+ value 、defaultValue、onChange
+ value 的类型是什么？
+ onChange 怎么规定 value 的类型

## 音频处理

## canvas/webGL

## history API

## requestAnimationFrame

## 地理位置



