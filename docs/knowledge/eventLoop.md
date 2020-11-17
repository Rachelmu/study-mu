# Event Loop

## JavaScript是如何工作的
JavaScript是单线程的   
什么是单线程呢？就是很多段JS代码，它的执行顺序是从上到下一行一行执行的，即只有当上一行的代码执行完后才会执行下一行代码    
在JS中有些代码是异步执行的，所谓异步，就是不会阻塞代码的运行，而会另外开启一个空间去执行这段异步代码，其余同步的代码就仍正常执行，若异步代码中有其它的代码，则会在之后的某个时刻将异步代码中其它代码执行。    
那么异步执行的额外空间是哪里来的？那当然是JS所处的运行环境提供的了，而JS最主要的两个运行环境就是：浏览器 和 Node，我们接下来也会基于这两个运行环境，对JS的运行机制进行讲解    

## 浏览器中的JavaScript
之所以JS能在浏览器中运行，那是因为浏览器都默认提供了一个JavaScript引擎，为JS提供一个运行环境   

### 调用栈
什么是调用栈？这里有一段代码，我们通过它来分析一下调用栈的运行过程   

``` js
function multiply(a, b) {
 return a * b
}

function calculate(n) {
 return multiply(n, n)
}

function print(n) {
 let res = calculate(n)
 console.log(res)
}

print(5)
```

当这段代码在浏览器中运行时，会先查询三个定义好了的函数 multiply 、calculate 和 print ；然后执行 print(5) 这段代码，因为这三个函数是有调用关系的，因此接下来依次调用了 calculate 函数 、multiply 函数    


### Event Loop
Event Loop 翻译过来叫做事件循环   

浏览器中的各种 Web API 为异步的代码提供了一个单独的运行空间，当异步的代码运行完毕以后，会将代码中的回调送入到 Task Queue（任务队列）中去，等到调用栈空时，再将队列中的回调函数压入调用栈中执行，等到栈空以及任务队列也为空时，调用栈仍然会不断检测任务队列中是否有代码需要执行，这一过程就是完整的Event Loop 了  


### 宏任务和微任务
``` js
console.log('1')

setTimeout(function callback(){
 console.log('2')
}, 1000)

new Promise((resolve, reject) => {
    console.log('3')
    resolve()
})
.then(res => {
    console.log('4');
})

console.log('5')
// 这段代码的打印结果顺序如何呢？
// 1
// 3
// 5
// 4
// 2
```
为什么 promise 和 setTimeout 同样是异步，为什么前者优先于后者？
这里就要引入另外两个概念了，即 macrotask（宏任务） 和 microtask（微任务）

下面列举了我们浏览器中常用的宏任务和微任务    

|  名称   | 	举例（常用）  |
|  ----  | ----  |
| 宏任务  | setTimeout 、setInterval 、UI rendering |
| 微任务  | promise 、requestAnimationFrame |

并且规定，当宏任务和微任务都处于 Task Queue 中时，微任务的优先级大于宏任务，即先将微任务执行完，再执行宏任务。   
当然，既然区分了宏任务和微任务，那么存放它们的队列也就分为两种，分别为macro task queue（宏队列） 和 micro task queue（微队列。    

根据相关规定，当调用栈为空时，对于这两个队列的检测情况步骤如下：
- 1.检测微队列是否为空，若不为空，则取出一个微任务入栈执行，然后执行步骤1；若为空，则执行步骤2
- 2.检测宏队列是否为空，若不为空，则取出一个宏任务入栈执行，然后执行步骤1；若为空，直接执行步骤1
- 3.……往复循环















