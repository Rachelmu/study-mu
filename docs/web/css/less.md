# less 详解

## 变量
### 定义
使用 @ 符号来定义变量 ，在Less中开头是 @ 则是变量，关于变量的命名方法，大家可以参考js中命名的规则，毕竟是做前端的，有着统一的习惯有助于我们统一风格。个人推荐变量名的命名规则使用驼峰命名法。第一个单词首写字母小写，从第二个开始，单词首写字母大写。如boxAaa,boxBbbb,boxContainer,……，当然也是可是使用香肠命名法用下划线“_”来命名。如，box_main,border_bottom,……

### 使用
在样式属性值中使用时，直接用 @variable 即可调用变量；

在其他地方，包括选择器名称、属性名称、URL和@import语句使用时，变量必须以插值的形式使用，例如：
```less
@variable: 200px; //定义变量作为样式属性值使用
@classname: .nav_a; //变量值不可用中划线，此变量作为插值用于选择器名称


@{classname}{ //作为插值 必须加 {}
    width: @variable; //作为属性值直接调用
}

// 输出
.nav_a {
  width: 200px;
}
```

变量特点：变量是懒加载的，不要求一定在使用之前声明。  
注：在同时定义一个变量两次时，会在使用变量的地方，从当前范围向上搜索，使用变量最后定义内的属性值。  
在定义变量时可以给变量赋一个初始值，后期在使用中通过重新定义或函数 来覆盖原本的初始值  

## extend扩展
:extend是一个伪类，使用它的选择器，将和它引用的选择器一起使用它引用的选择器的样式，如：  
先定义一个扩展的选择器，我们就叫它 .a，然后定义一个选择器 .b（用来扩展），在 .a内使用 :extend 扩展，代码如下  
``` less
.a{
    &:extend(.b);  //这里的 & 为 父选择符，代表的 父选择符 .a 扩展 .b
    font-size: 12px;
}
.b{
    font-weight: bold;
}

// 输出
.a {
  font-size: 12px;
}
.b,
.a {
  font-weight: bold;  //这里 a 扩展也引用了 b 的样式
}
```
注意：如果这里的 .b 内没有定义任何样式，那么编译后的css中， 不会有 .b 的任何输出，相应的 .a 也不会扩展到任何样式  

### 语法
:extend()可以附加到选择器后面，也可以放到样式规则中，它看起来就像是一个选择器的伪类，在使用的时候我们可以选择性的加上 关键字 all

语法示例：
``` less
.a:extend(.b){}   //方法一：附加到选择器后
.a{
    &:extend(.b)    // 方法二：写在样式规则中
}
```
### :extend() 直接使用在选择器后
每个选择器可以使用多个 :extend() 语句， 但是所使用的 :extend() 语句必须放在选择器末尾，下面详细描述

- 在选择器之后:extend ：pre:hover:extend(div pre)。
- 选择器和扩展之间允许有空格：pre:hover :extend(div pre)。
- 允许多个扩展：pre:hover:extend(div pre):extend(.bucket tr)- 注意这是相同的pre:hover:extend(div pre, .bucket tr)
- 这是不允许的：pre:hover:extend(div pre).nth-child(odd)。 extend必须在选择器末尾。  

如果规则集包含多个选择器，则它们中的任何一个选择器都可以具有extend关键字。在一个规则集中扩展的多个选择器：
``` less
.a,
.b:extend(.bag),
.c:extend(.bucket) {
  // 这里啊a,b,c  3个选择器都可以使用 :extend
}
```
### :extend()在样式规则中使用
把 :extend() 放到多个选择器共用的样式规则集中，是把样式扩展到每个选择器的最佳选择。

下面来个对比：

直接把: extend() 放到样式规则中，
```less
.a,
.c,
.d{
    &:extend(.b);
}
.b{
    font-size: 12rem;
}

// 输出
.b,
.a,
.c,
.d {
  font-size: 12rem;
}

// 如果把 :extend 放在选择器后，那么需要单独对 .a , .c , .d单独处理，会增加代码量，后期维护也很繁琐

.a:extend(.b){}
.c:extend(.b){}
.d:extend(.b){}
```
### 扩展 嵌套选择器
将:extend() 直接放在选择器后，可以扩展嵌套选择器样式规则，示例：

``` less
.my-table{
   .my-tr{
        font-size: 50px;
    }
}

.mt-other-table:extend(.my-table .my-tr){}
```
###  :extend中选择符的精确匹配
默认情况下，:extend() 中查找选择器的原则是精准匹配，就算是 选择器 在开始使用（例如  .class .a）也没用；或者是两个选择符表达式韩式一样，那在匹配过程中也没有意义，:extend()中选择器只能匹配到 具有相同形式的选择器。唯一例外的是属性选择器中的 引号 ，Less知道它们具有相同的含义并匹配它们。

示例：
``` less
.a.class,
.class.a,
.class>.a{
    color: blue;
}
.test:extend(.class) {}
```
编译下，命令行中报错了..... 没有匹配到  .class
``` less
$ lessc refer.less > refer.css
extend ' .class' has no matches
```

选择器前面的符号是很重要的， 虽然 *.class{} 和.class{}是一样的，但是在:extend(.class)中无法匹配到 *.class
``` less
*.class {
  color: blue;
}
.noStar:extend(.class) {} // 不会匹配到 *.class 
```
多个伪类在 :extend() 中的顺序也很重要，选择器link:hover:visited和link:visited:hover匹配相同的一组元素，但 :extend() 将它们视为不同。
``` less
link:hover:visited {
  color: blue;
}
.selector:extend(link:visited:hover) {}  //此时无法匹配到link:hover:visited
```

### 使用 n 的选择器 、使用属性筛选的选择器

#### 1n+3和n+3相当，但:extend不会匹配他们：
```less
:nth-child(1n+3) {
  color: blue;
}
.child:extend(n+3) {} // 无法匹配
````

#### 在属性选择器中的引用类型无关紧要。以下所有都是相同的。
``` less
[title=identifier] {
  color: blue;
}
[title='identifier'] {
  color: blue;
}
[title="identifier"] {
  color: blue;
}

.noQuote:extend([title=identifier]) {}
.singleQuote:extend([title='identifier']) {}
.doubleQuote:extend([title="identifier"]) {}
```

### :extend() 中关键字 all的使用
在使用extend时，在末尾添加 all 关键字，它会告诉Less作为另一个选择器的一部分匹配该选择器。选择器将被复制，只有选择器的匹配部分将被替换为扩展，从而创建一个新的选择器。

例：
``` less
.a.b.test,
.test.c {
  color: orange;
}
.test {
  &:hover {
    color: green;
  }
}

.replacement:extend(.test all) {}

// 输出
.a.b.test,
.test.c,
.a.b.replacement,
.replacement.c {
  color: orange;
}
.test:hover,
.replacement:hover {
  color: green;
}
```

### 选择器插值与extend
:extend不能将选择器与变量相匹配。如果选择器包含变量，扩展将忽略它；

变量无法与选择器匹配：

``` less
@variable: .bucket; //定义变量
@{variable} { // 变量插值
  color: blue;
}
.some-class:extend(.bucket) {} //没有做任何工作，此时无法匹配到 .selector
 

// 输出：仅仅只输出了 .selector 的样式规则

.bucket {
  color: blue;
}
```
但是，将 :extend 扩展直接写在 变量选择器后，可正常使用，将上例代码改为如下：
``` less
.bucket{
    color: blue;
}
@variable: some-class; //此时有中划线，将 . 移至变量插值前，否则会报错
.@{variable}:extend(.bucket){}  // 在变量选择器后使用 :extend ，正常编译

// 正常编译
.bucket,
.some-class {
  color: blue;
}
```
### 作用范围 / extend 在 @media 中的使用

#### 在 media 媒体声明中写入的 extend 只匹配同一媒体声明中的选择器:
``` less
@media print {
  .screenClass:extend(.selector) {} // extend inside media
  .selector { // 这会被匹配到 - 以为和extend在同一个media内
    color: black;
  }
}
.selector { // 规则集在上一个样式中 - extend 将忽略这
  color: red;
}
@media screen {
  .selector {  // r规则集在另一个样式中 - extend 将忽略这
    color: blue;
  }
}

// 输出
@media print {
  .selector,
  .screenClass { /*  ruleset inside the same media was extended */
    color: black;
  }
}
.selector { /* ruleset on top of style sheet was ignored */
  color: red;
}
@media screen {
  .selector { /* ruleset inside another media was ignored */
    color: blue;
  }
}
```

#### 在媒体声明中写入的 extend ，不匹配其嵌套声明中的选择器:
``` less
@media screen {
  .screenClass:extend(.selector) {} // extend inside media
  @media (min-width: 1023px) {
    .selector {  // css在media内部嵌套 - extend 将忽略它
      color: blue;
    }
  }
}

// 输出
@media screen and (min-width: 1023px) {
  .selector { /* ruleset inside another nested media was ignored */
    color: blue;
  }
}
```

#### 顶级 :extend 将匹配所有内容，包括嵌套媒体中的选择器
``` less
@media screen {
  .selector {  /* ruleset inside nested media - top level extend works */
    color: blue;
  }
  @media (min-width: 1023px) {
    .selector {  /* ruleset inside nested media - top level extend works */
      color: blue;
    }
  }
}

.topLevel:extend(.selector) {} /* 定层级 :extend 匹配所有 */

// 输出
@media screen {
  .selector,
  .topLevel { /* ruleset inside media was extended */
    color: blue;
  }
}
@media screen and (min-width: 1023px) {
  .selector,
  .topLevel { /* ruleset inside nested media was extended */
    color: blue;
  }
}
```

### 重复检测 - Duplication Detection
在使用:extend 时，less目前没有检测重复的 功能  
``` less
.alert-info,
.widget {
  /* declarations */
}

.alert:extend(.alert-info, .widget) {}

// 输出
.alert-info,
.widget,
.alert,
.alert {
  /* declarations */
}
```

### Extend案例扩展

1.典型用例

典型的用例是避免在html添加  基本选择器类别  。例如，如果你有
``` less
.animal {
  background-color: black;
  color: white;
}
````

然后你想要一种重写 `background-color` 的class类 ，这时你有两个方法，第一种方法是：改变你的HTML，添加另一个选择器类 bear
```less
<a class="animal bear">Bear</a>
.animal {
  background-color: black;
  color: white;
}
.bear {
  background-color: brown;
}

```
第二种方法是：简化html同时使用less的 :extend，例如
``` less
<a class="bear">Bear</a>
.animal {
  background-color: black;
  color: white;
}
.bear {
  &:extend(.animal);
  background-color: brown;
}
```

2. 减少css大小

mixin将所有属性复制到一个选择器中，这会导致不必要的重复。因此，您可以使用 :extend 而不是mixin将选择器移到您希望使用的属性，这样会大大减少生成的css。

当使用mixin时：
``` less
.my-inline-block() {
  display: inline-block;
  font-size: 0;
}
.thing1 {
  .my-inline-block;
}
.thing2 {
  .my-inline-block;
}

// 输出
.thing1 {
  display: inline-block;
  font-size: 0;
}
.thing2 {
  display: inline-block;
  font-size: 0;
}

// 改写使用 :extend( )
.my-inline-block {
  display: inline-block;
  font-size: 0;
}
.thing1 {
  &:extend(.my-inline-block);
}
.thing2 {
  &:extend(.my-inline-block);
}

.my-inline-block,
.thing1,
.thing2 {
  display: inline-block;
  font-size: 0;
}
```

3. 结合样式 / 更高级的混合

另一个用例是mixin的替代方案——因为mixin只能与简单的选择器一起使用，如果您在html上有两个不同的块，但是它们需要应用相同的样式到，那么您可以使用 :extend 来关联两个区域。

``` less
li.list > a {
  // list styles
}
button.list-style {
  &:extend(li.list > a); // use the same list styles
}
```