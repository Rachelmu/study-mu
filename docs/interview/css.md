# Css 面试题

[github](https://github.com/woai3c/Front-end-basic-knowledge/blob/master/CSS.md)

## 使用css，让一个div消失在视野中，发挥想象力？

## 请说明z-index的工作原理，适用范围？

## 文档流

## 定位

### border1px问题的形成原因

### 产生原因

- 设备像素比：dpr=window.devicePixelRatio，也就是设备的物理像素与逻辑像素的比值。像素比 = 物理像素 / css像素 
- 在`retina`屏的手机上, `dpr`为`2`或`3`，`css`里写的`1px`宽度映射到物理像素上就有`2px`或`3px`宽度。
- 例如：`iPhone6`的`dpr`为`2`，物理像素是`750`（x轴）,它的逻辑像素为`375`。也就是说，1个逻辑像素，在`x`轴和`y`轴方向，需要2个物理像素来显示，即：dpr=2时，表示1个CSS像素由4个物理像素点组成。

#### 解决方案

##### 0.5px方案

+ 在`IOS8+`，苹果系列都已经支持`0.5px`了，可以借助媒体查询来处理。

  ```
  /*这是css方式*/
  .border { border: 1px solid #999 }
  @media screen and (-webkit-min-device-pixel-ratio: 2) {
      .border { border: 0.5px solid #999 }
  }
  /*ios dpr=2和dpr=3情况下border相差无几，下面代码可以省略*/
  @media screen and (-webkit-min-device-pixel-ratio: 3) {
      .border { border: 0.333333px solid #999 }
  }
  ```

+ `IOS7`及以下和`Android`等其他系统里，`0.5px`将会被显示为`0px`。那么我们就需要想出办法解决，说实在一点就是找到`Hack`。

+ 解决方案是通过`JavaScript`检测浏览器能否处理`0.5px`的边框，如果可以，给`html`标签元素添加个`class`。

  ```
  if (window.devicePixelRatio && devicePixelRatio >= 2) {
    var testElem = document.createElement('div');
    testElem.style.border = '.5px solid transparent';
    document.body.appendChild(testElem);
  }
  if (testElem.offsetHeight == 1) {
    document.querySelector('html').classList.add('hairlines');
  }
    document.body.removeChild(testElem);
  }
  // 脚本应该放在body内，如果在里面运行，需要包装 $(document).ready(function() {})
  ```

+ 然后，极细的边框样式就容易了

  ```
  div {
    border: 1px solid #bbb;
  }
  .hairlines div {
    border-width: 0.5px;  
  }
  ```

+ 优点：简单，不需要过多代码。

+ 缺点：无法兼容安卓设备、 `iOS 7`及以下设备。

##### 伪类+transform

+ 原理：把原先元素的`border`去掉，然后利用`:before`或者`:after`重做`border`，并 `transform`的`scale`缩小一半，原先的元素相对定位，新做的`border`绝对定位。

```
/*手机端实现真正的一像素边框*/
.border-1px, .border-bottom-1px, .border-top-1px, .border-left-1px, .border-right-1px {
    position: relative;
}

/*线条颜色 黑色*/
.border-1px::after, .border-bottom-1px::after, .border-top-1px::after, .border-left-1px::after, .border-right-1px::after {
    background-color: #000;
}

/*底边边框一像素*/
.border-bottom-1px::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    transform-origin: 0 0;
}

/*上边边框一像素*/
.border-top-1px::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    transform-origin: 0 0;
}

/*左边边框一像素*/
.border-left-1px::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 1px;
    height: 100%;
    transform-origin: 0 0;
}

/*右边边框1像素*/
.border-right-1px::after {
    content: "";
    box-sizing: border-box;
    position: absolute;
    right: 0;
    top: 0;
    width: 1px;
    height: 100%;
    transform-origin: 0 0;
}

/*边框一像素*/
.border-1px::after {
    content: "";
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border: 1px solid gray;
}


/*设备像素比*/
/*显示屏最小dpr为2*/
@media (-webkit-min-device-pixel-ratio: 2) {
    .border-bottom-1px::after, .border-top-1px::after {
        transform: scaleY(0.5);
    }

    .border-left-1px::after, .border-right-1px::after {
        transform: scaleX(0.5);
    }

    .border-1px::after {
        width: 200%;
        height: 200%;
        transform: scale(0.5);
        transform-origin: 0 0;
    }
}

/*设备像素比*/
@media (-webkit-min-device-pixel-ratio: 3)  {
    .border-bottom-1px::after, .border-top-1px::after {
        transform: scaleY(0.333);
    }

    .border-left-1px::after, .border-right-1px::after {
        transform: scaleX(0.333);
    }

    .border-1px::after {
        width: 300%;
        height: 300%;
        transform: scale(0.333);
        transform-origin: 0 0;
    }
}
/*需要注意<input type="button">是没有:before, :after伪元素的*/
```

+ 优点：所有场景都能满足，支持圆角(伪类和本体类都需要加border-radius)。
+ 缺点：代码量也很大，对于已经使用伪类的元素(例如clearfix)，可能需要多层嵌套。

##### viewport + rem

+ 同时通过设置对应`viewport`的`rem`基准值，这种方式就可以像以前一样轻松愉快的写1px了。

+ 在`devicePixelRatio=2` 时，设置`meta`：

  ```
  <meta name="viewport" content="width=device-width,initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no">
  ```

+ 在`devicePixelRatio=3` 时，设置`meta`：

  ```
  <meta name="viewport" content="width=device-width,initial-scale=0.3333333333333333, maximum-scale=0.3333333333333333, minimum-scale=0.3333333333333333, user-scalable=no">
  ```

+ 验证

  ```
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <title>移动端1px问题</title>
      <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
      <meta name="viewport" id="WebViewport"
          content="width=device-width,initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
      <style>
          html {
              font-size: 11px;
          }
          body {
              padding: 1rem;
          }
          * {
              padding: 0;
              margin: 0;
          }
          .item {
              padding: 1rem;
              border-bottom: 1px solid gray;
              font-size: 1.2rem;
          }
      </style>
      <script>
          var viewport = document.querySelector("meta[name=viewport]");
          var dpr = window.devicePixelRatio || 1;
          var scale = 1 / dpr;
          //下面是根据设备dpr设置viewport
          viewport.setAttribute(
              "content", +
              "width=device-width," +
              "initial-scale=" +
              scale +
              ", maximum-scale=" +
              scale +
              ", minimum-scale=" +
              scale +
              ", user-scalable=no"
          );
  
          var docEl = document.documentElement;
          var fontsize = 10 * (docEl.clientWidth / 320) + "px";
          docEl.style.fontSize = fontsize;
      </script>
  </head>
  <body>
      <div class="item">border-bottom: 1px solid gray;</div>
      <div class="item">border-bottom: 1px solid gray;</div>
  </body>
  </html>
  ```

+ 优点：所有场景都能满足，一套代码，可以兼容基本所有布局。
+ 缺点：老项目修改代价过大，只适用于新项目。

##### border-image

##### background-image

```
.background-image-1px {
  background: url(../img/line.png) repeat-x left bottom;
  background-size: 100% 1px;
}
```

+ 优点：可以设置单条,多条边框，没有性能瓶颈的问题。
+ 缺点：修改颜色麻烦, 需要替换图片；圆角需要特殊处理，并且边缘会模糊。

##### postcss-write-svg

+ 使用`border-image`每次都要去调整图片，总是需要成本的。基于上述的原因，我们可以借助于`PostCSS`的插件`postcss-write-svg`来帮助我们。如果你的项目中已经有使用`PostCSS`，那么只需要在项目中安装这个插件。然后在你的代码中使用：

  ```
  @svg 1px-border {
      height: 2px;
      @rect {
        fill: var(--color, black);
        width: 100%;
        height: 50%;
      }
  }
  .example {
      border: 1px solid transparent;
      border-image: svg(1px-border param(--color #00b1ff)) 2 2 stretch;
   }
   // 编辑出来
   .example {
      border: 1px solid transparent;
      border-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='2px'%3E%3Crect fill='%2300b1ff' width='100%25' height='50%25'/%3E%3C/svg%3E")
            2 2 stretch;
    }
  ```

#### 总结

+ `0.5px`，相信浏览器肯定是会慢慢支持的，目前而言，如果能用的话，可以`hack`一下。
+ 对于老项目，建议采用`transform`+伪类。
+ 新项目可以设置`viewport`的`scale`值，这个方法兼容性好。
+ `postcss-write-svg`简单易用，仅适合直线，圆角建议用`transform`+伪类实现。

## 如何使用一个div里面的文字垂直居中，且该文字的大小根据屏幕大小自适应？

## 考察盒子模型和 `box-sizing` 属性，判断元素的尺寸和颜色。

## 垂直水平居中

## position有哪些属性

## less,sass它们的作用是什么

## 避免 css 全局污染。

+ 我常用的 css modules
+ scoped

## css modules 的原理

+ 生成唯一的类名

## 有一个 a 标签，如何动态的决定他的样式。

+ 我说了先写几个 css，然后外部传一个前缀的方式。面试官问了都要这样吗？我说可以通过 context 的方式，就不需要每个组件都传了。

## 用css画一个扇形


## flex

### `flex: 0 1 auto;` 是什么意思？

+ flex 这个属性常考题，好好把阮老师的那篇 **flex 语法篇**[2]看完 flex 的面试题基本没问题。
+ flex 语法篇: *https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html*

## less

### less 的&代表什么

## 动画

### 动画？补间动画实现

+ 补间动画就是指控制最开始的状态和最末的状态的动画，中间的状态由浏览器自动帮我们计算生成
+ transition动画最主要的属性是transition属性，它其实是4个属性的缩写。