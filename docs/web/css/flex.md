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
``` js
flex-direction: row | row-reverse | column | column-reverse
```
- row: flex容器的主轴被定义为与文本方向相同。 主轴起点和主轴终点与内容方向相同.简单理解就是主轴沿着水平方向向右.


### 容器
- 父容器（container)
- 子容器（item）
