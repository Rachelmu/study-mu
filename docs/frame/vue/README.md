# Vue 介绍

从今天开始让我们一起来学习Vue相关的知识吧。

Vue 基于 MVVM，但是Vue并不完全遵循MVVM 模型，那什么是MVVM模型呢？让我们一起来看看吧。

# 模型介绍
## MVC
### MVC把软件分为三个层
- 视图（View）：用户界面。
- 控制器（Controller）：业务逻辑
- 模型（Model）：数据保存

### MVC模型数据都是单向的
::: tip 数据流程

用户行为改变(点击事件)Viwe -> View通知Contoller进行逻辑处理 -> 处理后Controller通知Model层数据改变
-> Model数据改变后交给View渲染(改变view层)

注:用户也可以直接改变Contoller
:::

## MVP
- MVP可以看做是MVC的衍生物,在MVP中Model不能直接操作View,且所有的通讯都是双向的

## MVVM
- MVVM 模式将 Presenter 改名为 ViewModel，基本上与 MVP 模式完全一致。唯一的区别是，它采用双向绑定（data-binding）：View的变动，自动 反映在 ViewModel，反之亦然

# Vue模型
## Vue 基于 MVVM
- Vue 基于 MVVM，但是Vue并不完全遵循MVVM 模型
- 严格意义上在MVVM中 View和Model之间是不能通讯的,但Vue却提供了相应的Api $refs
- 所以说，Vue并不是正在意义上的MVVM架构,但是思想是借鉴了MVVM然后又进行了些本土化,不过问题不大,现在根据MVVM本土化出来的架构都统称MV*架构
- 要注意的是，MVVM 对应了三个层，M - Model，可以简单的理解为数据层；V - View，可以理解为视图，或者网页界面；VM - ViewModel，一个抽象层，简单来说可以认为是 V 层中抽象出的数据对象，并且可以与V 和 M 双向互动（一般实现是基于双向绑定，双向绑定的处理方式在不同框架中不尽相同）。

