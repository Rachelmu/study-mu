# js基础

## JavaScript 深入之从原型到原型链

### 构造函数创建对象

我们先使用构造函数创建一个对象：
``` js

function Person() {

}
var person = new Person();
person.name = 'name';
console.log(person.name) // name

```

在这个例子中，Person就是一个构造函数，我们使用new创建了一个实例对象person。

很简单吧，接下来进入正题：

### prototype
每个函数都有一个prototype属性，就是我们经常在各种例子中看到的那个prototype，比如：
``` js

function Person() {

}
// 虽然写在注释里，但是你要注意：
// prototype是函数才会有的属性
Person.prototype.name = 'name';
var person1 = new Person();
var person2 = new Person();
console.log(person1.name) // name
console.log(person2.name) // name

```
那这个函数的prototype属性到底指向的是什么呢？是这个函数的原型吗？   

其实，函数的prototype属性指向了一个对象，这个对象正是调用该构造函数而创建的实例的原型,也就是这个例子中的person1和person2的原型。   

那么什么是原型呢？你可以这样理解：每一个JavaScript对象(null除外)在创建的时候就会与之关联另一个对象，这个对象就是我们所说的原型，每一个对象都会从原型"继承"属性。
