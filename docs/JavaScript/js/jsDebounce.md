# debounce 防抖& throttle 节流

## 防抖 (debounce)

想要了解一个概念，必先了解概念所应用的场景。在 JS 这个世界中，有哪些防抖的场景呢   

+ 登录、发短信等按钮避免用户点击太快，以致于发送了多次请求，需要防抖   
+ 调整浏览器窗口大小时，resize 次数过于频繁，造成计算过多，此时需要一次到位，就用到了防抖   
+ 文本编辑器实时保存，当无任何更改操作一秒后进行保存   

「防抖重在清零 clearTimeout(timer)」

::: tip 防抖定义
防抖：防止抖动，单位时间内事件触发会被重置，避免事件被误伤触发多次。「代码实现重在清零 clearTimeout」。防抖可以比作等电梯，只要有一个人进来，就需要再等一会儿。业务场景有避免登录按钮多次点击的重复提交。
:::

## 事例
在前端开发中会遇到一些频繁的事件触发，比如：

window 的 resize、scroll
mousedown、mousemove
keyup、keydown
……

我们举个示例代码来了解事件如何频繁的触发：
``` html
<!DOCTYPE html>
<html lang="zh-cmn-Hans">

<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="IE=edge, chrome=1">
    <title>debounce</title>
    <style>
        #container{
            width: 100%; height: 200px; line-height: 200px; text-align: center; color: #fff; background-color: #444; font-size: 30px;
        }
    </style>
</head>

<body>
    <div id="container"></div>
    <script src="debounce.js"></script>
</body>

</html>
```
debounce.js 文件的代码如下：
``` js
var count = 1;
var container = document.getElementById('container');

function getUserAction() {
    container.innerHTML = count++;
};

container.onmousemove = getUserAction;
```
从左边滑到右边就触发了 165 次 getUserAction 函数！

因为这个例子很简单，所以浏览器完全反应的过来，可是如果是复杂的回调函数或是 ajax 请求呢？假设 1 秒触发了 60 次，每个回调就必须在 1000 / 60 = 16.67ms 内完成，否则就会有卡顿出现。

为了解决这个问题，一般有两种解决方案：

debounce 防抖
throttle 节流


## 防抖
防抖的原理就是：你尽管触发事件，但是我一定在事件触发 n 秒后才执行，如果你在一个事件触发的 n 秒内又触发了这个事件，那我就以新的事件的时间为准，n 秒后才执行，总之，就是要等你触发完事件 n 秒内不再触发事件，我才执行，真是任性呐!

### 第一版
根据这段表述，我们可以写第一版的代码：
``` js
// 第一版
function debounce(func, wait) {
    var timeout;
    return function () {
        clearTimeout(timeout)
        timeout = setTimeout(func, wait);
    }
}
```

### 第二版
``` js
// 第二版
function debounce(func, wait) {
    var timeout;

    return function () {
        var context = this;

        clearTimeout(timeout)
        timeout = setTimeout(function(){
            func.apply(context)
        }, wait);
    }
}
```

## 节流 (throttle)
节流，顾名思义，控制水的流量。控制事件发生的频率，如控制为1s发生一次，甚至1分钟发生一次。与服务端(server)及网关(gateway)控制的限流 (Rate Limit) 类似。     

+ scroll 事件，每隔一秒计算一次位置信息等
+ 浏览器播放事件，每个一秒计算一次进度信息等
+ input 框实时搜索并发送请求展示下拉列表，每隔一秒发送一次请求 (也可做防抖)    

「节流重在加锁 timer=timeout」

::: tip 节流定义
节流：控制流量，单位时间内事件只能触发一次，与服务器端的限流 (Rate Limit) 类似。「代码实现重在开锁关锁 timer=timeout; timer=null」。节流可以比作过红绿灯，每等一个红灯时间就可以过一批。
:::





























