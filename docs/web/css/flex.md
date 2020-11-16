# flex详解
## flex 基本概念
### 轴
- 主轴（mian axis）
- 交叉轴（cross axis）
#### 轴解析
- 主轴的方向是从左向右的，交叉轴垂直于主轴，逆时针方向90度，
- 交叉轴是由主轴决定的，主轴又是由flex-direction决定的
- 那么接下来我们看flex-direction是如何决定主轴的
#### flex-direction
- flex-direction属性设置在父容器上，这样子才可以生效
``` css
flex-direction: row | row-reverse | column | column-reverse
```
- row: flex容器的主轴被定义为与文本方向相同。 主轴起点和主轴终点与内容方向相同.简单理解就是主轴沿着水平方向向右.简单理解就是主轴沿着水平方向向右
- row-reverse: 表现和row相同，但是置换了主轴起点和主轴终点。简单理解就是主轴沿着水平方向向左，与文本方向相反。
- column: flex容器的主轴和块轴相同。主轴起点与主轴终点和书写模式的前后点相同。简单的理解，就是主轴变成Y轴方向，方向从上到下布局。
- column-reverse: 表现和column相同，但是置换了主轴起点和主轴终点。简单的理解，就是主轴变成Y轴方向，方向从下到上，与书写的方向相反。

### 容器
- 父容器（container)
- 子容器（item）

#### 父容器

#### justify-content: 设置子元素在主轴方向上的对齐方式
- 决定子元素在主轴方向上的对齐方式
- flex-start: 子元素沿着主轴方向开始对齐。
- flex-end:  子元素沿着主轴方向终点对齐。
- center: 子元素在主轴方向上水平居中。
- space-between: 子元素在主轴方向上两端对齐，项目之间间隔相等。
- space-around: 子元素在主轴方向上均匀排列每个元素，每个元素周围分配相同的空间。

#### align-items： 设置子元素在交叉轴方向上的对齐方式
- flex-start: 子元素在交叉轴方向上起点对齐。
- flex-end: 子元素在交叉轴方向上终点对齐。
- flex-center: 子元素在交叉轴方向上居中对齐。
- baseline: 子元素在交叉轴方向上以文字基线对齐。
- stretch: 这个属性是默认的，如果项目未设置高度或者设为 auto，将占满整个容器的高度。


#### 子容器
##### align-self
- align-self属性 单独设置子容器如何沿交叉轴排列
	+ 每个子容器都可以单独定义沿交叉轴排列方式。
	+ 该属性的取值跟父容器中的align-items属性一致，如果两者相同的话，则以子容器align-self属性为主。
- align-self作用规则
	+ flex-start: 起始端对齐
	+ flex-end: 末尾段对齐
	+ baseline: 基线对齐,末尾段对齐
	+ stretch: 拉伸对齐

#### flex
- flex属性 定义在主轴是如何伸缩的
	+ 子容器是有弹性的，它们会自动填充剩余空间，子容器的伸缩比由flex属性决定。
	+ flex是多个属性的缩写，允许1-3个值的连写，具体参考上面的图。
- flex作用规则
	+ 三个属性的简写，是flex-grow  flex-shrink flex-basis的简写
	+ 常用简化写法👇
		- flex:1 —>  flex:1 1 0%;
		- flex:3 —> flex:3 1 0%;
	+ 注意:flexbox布局和原来的布局是两个概念，部分css属性在flexbox盒子里面不起作用，eg：float， clear， column,vertical-align 等等

### flex更深入了解
#### 父容器（container）
- flex-wrap  设置换行方式
	+ 绝对子容器是否可以选择换行，一般而言有三种状态，支持换行的话，也支持逆序换行。
- flex-flow 设置轴向与换行组合
	+ 是`flex-direction` 和 `flex-wrap` 的简写。
	+ 所以只要掌握，`flex-direction` 和 `flex-wrap`即可。
- align-content  多行沿交叉轴对齐方式
	+ 当子容器多行排列时，设置行与行之间的对齐方式。


















