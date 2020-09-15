# js基础面试题

## JavaScript

[面试题](https://github.com/Advanced-Frontend/Daily-Interview-Question/blob/master/datum/summary.md)

### JS运行机制

- 关键词: 单线程 => 同步任务和异步任务
- 同步任务在主线程上执行，形成一个执行栈
- 主线程之外，事件触发线程管理着一个任务队列，只要异步任务有了运行结果，就在任务队列之中放置一个事件
- 一旦执行栈中的所有同步任务执行完毕（此时JS引擎空闲），系统就会读取任务队列，将可运行的异步任务添加到可执行栈中，开始执行

### 变量提升和函数提升

- 函数优先。函数声明和变量声明都会被提升，但是函数会首先被提升，然后才是变量

- 实例

  ```javascript
  foo(); // 1
  var foo;
  function foo() { console.log( 1 );
  }
  foo = function() { console.log( 2 );
  };
  ```

  会被引擎解析诚如下代码

  ```javascript
  function foo() { console.log( 1 );
  }
  foo(); // 1
  foo = function() { console.log( 2 );
  };
  ```

- 注意，var foo 尽管出现在 function foo()... 的声明之前，但它是重复的声明(因此被忽 略了)，因为函数声明会被提升到普通变量之前。

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

## DOM

1. cookie有哪些属性
2. cookie,session,localstorage,sessionstorage有什么区别
3. 怎么禁止js访问cookie


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



### 防抖和节流

1. 防抖：在事件被触发N秒后在执行回调，如果在这N秒内又被触发，则重新计时
   - 实现思路：通过闭包保存一个标记来保存 setTimeout 返回的值，每当用户输入的时候把前一个 setTimeout clear 掉，然后又创建一个新的 setTimeout，这样就能保证输入字符后的 interval 间隔内如果还有字符输入的话，就不会执行 fn 函数了。

```javascript
function debounce(fn, interval = 300) {
    let timeout = null;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn.apply(this, arguments);
        }, interval);
    };
}
function scroll(e) {console.log(e)}
window.onscroll = debounce(scroll, 500)
```
2. 节流：规定一个单位时间，在这个单位时间内，只能执行一次回调，如果触发了多次，只有一次生效
   - 实现思路: 函数的节流就是通过闭包保存一个标记（canRun = true），在函数的开头判断这个标记是否为 true，如果为 true 的话就继续执行函数，否则则 return 掉，判断完标记后立即把这个标记设为 false，然后把外部传入的函数的执行包在一个 setTimeout 中，最后在 setTimeout 执行完毕后再把标记设置为 true（这里很关键），表示可以执行下一次的循环了。当 setTimeout 还未执行的时候，canRun 这个标记始终为 false，在开头的判断中被 return 掉。

```javascript
function throttle(fn, interval = 300) {
    let canRun = true;
    return function () {
        if (!canRun) return;
        canRun = false;
        setTimeout(() => {
            fn.apply(this, arguments);
            canRun = true;
        }, interval);
    };
}
```



### 深拷贝和浅拷贝

- 浅拷贝
  - 浅拷贝就是拷贝指向对象的指针,意思就是说:拷贝出来的目标对象的指针和源对象的指针指向的内存空间是同一块空间.
  - 浅拷贝只是一种简单的拷贝,让几个对象公用一个内存,然而当内存销毁的时候,指向这个内存空间的所有指针需要重新定义,不然会造成野指针错误
- 深拷贝
  - 所谓的深拷贝指拷贝对象的具体内容,其内容地址是自助分配的,拷贝结束之后,内存中的值是完全相同的,但是内存地址是不一样的,两个对象之间相互不影响,也互不干涉.

### bind、call、apply

- 第一个参数都是改变this的上下文，改变this指向
- bind：改变this指向，但不会马上执行，而是返回一个函数
- call：第二个参数开始以参数列表的形式展现
- apply: 第二个参数接受一个数组

### async/await

- `async/await`实际上是`Generator`的语法糖。顾名思义，`async`关键字代表后面的函数中有异步操作，`await`表示等待一个异步方法执行完成。

  ```javascript
  async function func() {
    console.log('async function is running!');
    const num1 = await 200;
    console.log(`num1 is ${num1}`);
    const num2 = await num1+ 100;
    console.log(`num2 is ${num2}`);
    const num3 = await num2 + 100;
    console.log(`num3 is ${num3}`);
  }
  
  func();
  console.log('run me before await!');
  // async function is running!
  // run me before await!
  // num1 is 200
  // num2 is 300
  // num3 is 400
  ```

- 错误捕获

  - try/catch
  - Promise.then

### Array方法

- some: 测试是否至少有一个元素可以通过被提供的函数方法。返回布尔值

- every: 测试一个数组内的所有元素是否都能通过某个指定函数的方法。返回布尔值

- reduce: 对数组中的每一个元素执行一个由您提供的reduce函数，将其结果汇总为单个返回值

- flat: 按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。

  - ```javascript
    var arr1 = [1, 2, [3, 4]];
    arr1.flat(); 
    // [1, 2, 3, 4]
    
    var arr2 = [1, 2, [3, 4, [5, 6]]];
    arr2.flat();
    // [1, 2, 3, 4, [5, 6]]
    
    var arr3 = [1, 2, [3, 4, [5, 6]]];
    arr3.flat(2);
    // [1, 2, 3, 4, 5, 6]
    
    //使用 Infinity 作为深度，展开任意深度的嵌套数组
    arr3.flat(Infinity); 
    // [1, 2, 3, 4, 5, 6]
    ```

### 原型和原型链

- [详解](https://www.jianshu.com/p/dee9f8b14771)

- 所有函数对象的 __proto__ 都指向 Function.prototype，它是一个空函数（Empty function）

- 所有对象的 __proto__ 都指向其构造器的 prototype

  ```javascript
  function Person(name) {
    this.name = name;
  }
  var p = new Person('jack')
  console.log(p.__proto__ === Person.prototype) // true
  ```

- 实例对象的内部原型总是指向其构造器的原型对象prototype

  ```javascript
  function Person(name) {
      this.name = name
  }
  var p = new Person('jack')
  console.log(p.__proto__ === p.constructor.prototype) // true
  ```

- Function.prototype.__proto__ === Object.prototype //true
- `Object.prototype.__proto__ === null`，保证原型链能够正常结束

### class, extends, super

- class: 创建一个带有作用域的对象
- extends: class可以通过extends实现继承
- super: 表示父类的构造函数，用来新建父类的this对象

```
  class Point {
  }

  class ColorPoint extends Point {
    constructor(x, y, color) {
        super(x, y); // 调用父类的constructor(x, y)
        this.color = color;
    }

    toString() {
        return this.color + ' ' + super.toString(); // 调用父类的toString()
    }
  }
```

### Cookie,LocalStorage,SessionStorage

| 特性           | Cookie                                                       | LocalStorage                                                | SessionStorage                               |
| -------------- | ------------------------------------------------------------ | ----------------------------------------------------------- | -------------------------------------------- |
| 数据的生命期   | 一般由服务器生成，可设置失效时间。如果在浏览器端生成Cookie，默认是关闭浏览器后失效 | 除非被清除，否则永久保存                                    | 仅在当前会话下有效，关闭页面或浏览器后被清除 |
| 存放数据大小   | 4K左右                                                       | 一般为5MB                                                   |                                              |
| 与服务器端通信 | 每次都会携带在HTTP头中，如果使用cookie保存过多数据会带来性能问题 | 仅在客户端（即浏览器）中保存，不参与和服务器的通信          |                                              |
| 易用性         | 需要程序员自己封装，源生的Cookie接口不友好                   | 源生接口可以接受，亦可再次封装来对Object和Array有更好的支持 |                                              |

### 阻塞渲染：CSS 与 JavaScript

**css**

- CSS被视为阻塞渲染的资源，这意味着浏览器将不会渲染任何已处理的内容，直至 CSSOM 构建完毕。
- 存在阻塞的 CSS 资源时，浏览器会延迟 JavaScript 的执行和 DOM 构建。
- CSSOM 构建时，JavaScript 执行将暂停，直至 CSSOM 就绪。

```
<style> p { color: red; }</style>
<link rel="stylesheet" href="index.css">
```

- 这样的 link 标签（无论是否 inline）会被视为阻塞渲染的资源，浏览器会优先处理这些 CSS 资源，直至 CSSOM 构建完毕。

```
<link href="index.css" rel="stylesheet">
<link href="print.css" rel="stylesheet" media="print">
<link href="other.css" rel="stylesheet" media="(min-width: 30em) and (orientation: landscape)">
```

- 第一个资源会加载并阻塞。
- 第二个资源设置了媒体类型，会加载但不会阻塞，print 声明只在打印网页时使用。
- 第三个资源提供了媒体查询，会在符合条件时阻塞渲染。

**JavaScript**

- 当浏览器遇到一个 script 标记时，DOM 构建将暂停，直至脚本完成执行。

### 改变阻塞模式：defer 与 async

**defer**

```
<script src="app1.js" defer></script>
<script src="app2.js" defer></script>
<script src="app3.js" defer></script>
```

- defer 属性表示延迟执行引入的 JavaScript，即这段 JavaScript 加载时 HTML 并未停止解析，这两个过程是并行的。整个 document 解析完毕且 defer-script 也加载完成之后（这两件事情的顺序无关），会执行所有由 defer-script 加载的 JavaScript 代码，然后触发 DOMContentLoaded 事件。
- defer 不会改变 script 中代码的执行顺序，示例代码会按照 1、2、3 的顺序执行。所以，defer 与相比普通 script，有两点区别：载入 JavaScript 文件时不阻塞 HTML 的解析，执行阶段被放到 HTML 标签解析完成之后。

**async**

```
script src="app.js" async></script>
<script src="ad.js" async></script>
<script src="statistics.js" async></script>
```

- async 属性表示异步执行引入的 JavaScript，与 defer 的区别在于，如果已经加载好，就会开始执行——无论此刻是 HTML 解析阶段还是 DOMContentLoaded 触发之后。

### 对象到字符串的转换步骤

1. 如果对象有toString()方法，javascript调用它。如果返回一个原始值（primitive value如：string number boolean）,将这个值转换为字符串作为结果
2. 如果对象没有toString()方法或者返回值不是原始值，javascript寻找对象的valueOf()方法，如果存在就调用它，返回结果是原始值则转为字符串作为结果
3. 否则，javascript不能从toString()或者valueOf()获得一个原始值，此时throws a TypeError

### 函数内部arguments变量有哪些特性,有哪些属性,如何将它转换为数组

- arguments[index]分别对应函数调用时的实参，并且通过arguments修改实参时会同时修改实参 
- arguments.length为实参的个数（Function.length表示形参长度） 
- arguments.callee为当前正在执行的函数本身，使用这个属性进行递归调用时需注意this的变化 
- 转换为数组：var args = Array.prototype.slice.call(arguments, 0);

### 评价一下三种方法实现继承的优缺点,并改进

```
function Shape() {}

function Rect() {}

// 方法1 原型继承
Rect.prototype = new Shape();

// 方法2 原型链继承
Rect.prototype = Shape.prototype;

// 方法3 混合方式继承
Rect.prototype = Object.create(Shape.prototype);

Rect.prototype.area = function () {
  // do something
};
```

**方法1：原型继承**

- 优点：正确设置原型链实现继承
- 优点：父类实例属性得到继承，原型链查找效率提高，也能为一些属性提供合理的默认值
- 缺点：父类实例属性为引用类型时，不恰当地修改会导致所有子类被修改
- 缺点：创建父类实例作为子类原型时，可能无法确定构造函数需要的合理参数，这样提供的参数继承给子类没有实际意义，当子类需要这些参数时应该在构造函数中进行初始化和设置
- 总结：继承应该是继承方法而不是属性，为子类设置父类实例属性应该是通过在子类构造函数中调用父类构造函数进行初始化

**方法2：原型链继承**

- 优点：正确设置原型链实现继承
- 缺点：父类构造函数原型与子类相同。修改子类原型添加方法会修改父类

**方法3：**

- 优点：正确设置原型链且避免方法1.2中的缺点
- 缺点：ES5方法需要注意兼容性

**改进：**

- 所有三种方法应该在子类构造函数中调用父类构造函数实现实例属性初始化

```
function Rect() {
    Shape.call(this);
}
```

- 用新创建的对象替代子类默认原型，设置Rect.prototype.constructor = Rect;保证一致性
- 第三种方法的polyfill：

```
function create(obj) {
    if (Object.create) {
        return Object.create(obj);
    }

    function f() {};
    f.prototype = obj;
    return new f();
}
```

**方法4： Class,extends继承**

```
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y);    this.color = color; // 正确
  }
}
```

### 什么是闭包，闭包的作用

- 闭包是一个函数，能将创建的变量的值始终保持在内存中，以供本地环境使用。
- 函数内部可以直接访问外部变量，但在函数外部无法访问函数内部变量。使用闭包的主要作用就是间接访问函数的内部数据。

```
function showNum() {
  var num = 12;
  function showNum2() {
    console.log(num);
  };
  return showNum2;
}
var myNum = showNum();
myNum();//12
```

- 将创建的变量的值始终保持在内存中，以供本地环境使用。

```
function showNum() {
  var num = 12;
  function showNum2() {
    console.log(++num);
  };
  return showNum2;
}
var myNum = showNum();
myNum();//13
```

### 箭头函数和普通函数有什么区别

- 箭头函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象，用call，apply，bind也不能改变this指向
- 箭头函数不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。
- 箭头函数不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。
- 箭头函数不可以使用yield命令，因此箭头函数不能用作 Generator 函数。
- 箭头函数没有原型对象prototype

### 排序

- sort

```javascript
var arr = [1,4,-8,-3,6,12,9,8];
arr.sort((a,b) => {
      return a-b;
})
console.log(arr);
```

- 冒泡排序

```javascript
var arr = [1,4,-8,-3,6,12,9,8];

function bubbleSort(arr){
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr.length-i-1; j++) {
            if(arr[j] > arr[j+1]){
                var c = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = c;
            }
        }
    }
    return arr;
}    
console.log(bubbleSort(arr));
```

- [查看更多](https://blog.csdn.net/lianwenxiu/article/details/88087176)

### JavaScript内存机制之问——数据是如何存储的？

- 基本数据类型用栈存储，引用数据类型用堆存储。（闭包变量是存在堆内存中的。）
- 基本数据类型：boolean string number null undefined symbol bigint
- 引用数据类型：object function array 

### JS异步编程有哪些方案？为什么会出现这些方案？

#### 回调函数

- 很容易产生回调地狱。代码可读性和可维护性差，每次任务可能会失败，需要在回调里面对每个任务的失败情况进行处理，增加了代码的混乱程度。

### Promise原理

- 三种状态: 等待态(Pending)、执行态（Fulfilled）、拒绝态（Pejected）

#### promise

- 解决了回调地狱，增加了代码可读性

```javascript
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECT = 'reject'

function MyPromise(executor) {
    let self = this
    self.value = null
    self.error = null
    self.status = PENDING
    self.onFulfilled = null; //成功的回调函数
    self.onRejected = null; //失败的回调函数
    const resolve = (value) => {
        if(self.status !== PENDING) return
        setTimeout(() => {
            self.status = FULFILLED;
            self.value = value;
            self.onFulfilled(self.value);//resolve时执行成功回调
        })
    }
    const reject = (error) => {
       if(self.status !== PENDING) return
        setTimeout(() => {
            self.status = REJECT;
            self.error = error;
            self.onRejected(self.error);//reject时执行失败回调
        })
    }
    executor(resolve, reject);
}
MyPromise.prototype.then = function(onFulfilled, onRejected) {
  if (this.status === PENDING) {
    this.onFulfilled = onFulfilled;
    this.onRejected = onRejected;
  } else if (this.status === FULFILLED) {
    //如果状态是fulfilled，直接执行成功回调，并将成功值传入
    onFulfilled(this.value)
  } else {
    //如果状态是rejected，直接执行失败回调，并将失败原因传入
    onRejected(this.error)
  }
  return this;
}
```

#### async + await

- ES7新增，加上 async 的函数都默认返回一个 Promise 对象

- ```javascript
  const readFileAsync = async function () {
    const f1 = await readFilePromise('1.json')
    const f2 = await readFilePromise('2.json')
    const f3 = await readFilePromise('3.json')
    const f4 = await readFilePromise('4.json')
  }
  ```

### require和import

- require：运行时调用；使用module.exports导出

- import：编译时调用，必须放在文件开头引入

  - export和import
  - export：用于对外输出本模块（一个文件可以理解为一个模块）变量的接口
  - import：用于在一个模块中加载export输出变量的接口

- require/exports 和 import/export 形式不一样

  require/exports 的写法：

  ```text
  const fs = require('fs')
  exports.fs = fs
  module.exports = fs
  ```

  import/export 的写法：

  ```text
  import fs from 'fs'
  import {default as fs} from 'fs'
  import * as fs from 'fs'
  import {readFile} from 'fs'
  import {readFile as read} from 'fs'
  import fs, {readFile} from 'fs'
  
  export default fs
  export const fs
  export function readFile
  export {readFile, read}
  export * from 'fs'
  ```

