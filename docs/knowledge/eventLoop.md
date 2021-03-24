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

## Node.js中的JavaScript
注： 此次讨论的都是针对Node.js 11.x以上的版本    

本文分别讨论了JS在浏览器环境和Node.js环境这两种情况，那自然是有所区别的，后者相对于前者的过程分得更加细致    


### node中的Event Loop

Node.js的Event Loop 是基于libuv实现的   

通过 Node.js 的官方文档可以得知，其事件循环的顺序分为以下六个阶段，每个阶段都会处理专门的任务：   

- timers： 计时器阶段，用于处理setTimeout以及setInterval的回调函数
- pending callbacks： 用于执行某些系统操作的回调，例如TCP错误
- idle, prepare： Node内部使用，不用做过多的了解
- poll： 轮询阶段，执行队列中的 I/O 队列，并检查定时器是否到时
- check： 执行setImmediate的回调
- close callbacks： 处理关闭的回调，例如 socket.destroy()

以上六个阶段，我们需要重点关注的只有四个，分别是 timers 、poll 、check 、close callbacks。  

这四个阶段都有各自的宏队列，只有当本阶段的宏队列中的任务处理完以后，才会进入下一个阶段。在执行的过程中会不断检测微队列中是否存在待执行任务，若存在，则执行微队列中的任务，等到微队列为空了，再执行宏队列中的任务（这一点与浏览器非常类似，但在Node 11.x版本之前，并不是这样的运行机制，而是运行完当前阶段队列中的所有宏任务以后才会去检测微队列。对于11.x 之后的版本，虽然在官网我还没找到相关文字说明是这样的，但通过无数次的运行，暂且可以说是这样的）    

同理，Node.js也有宏任务和微任务之分，我们来看一下常用的都有哪些  
|  名称   | 	举例（常用）  |
|  ----  | ----  |
| 宏任务  | setTimeout 、setInterval 、setImmediate |
| 微任务  | Promise 、process.nextTick |

可以看到，在Node.js对比浏览器多了两个任务，分别是宏任务 setImmediate 和 微任务 process.nextTick。   

setImmediate 会在 check 阶段被处理     

process.nextTick 是Node.js中一个特殊的微任务，因此会为它单独提供一个队列，称为 next tick queue，并且其优先级大于其它的微任务，即若同时存在 process.nextTick 和 promise，则会先执行前者       

``` js
setTimeout(() => {
    console.log(1);
}, 0)

setImmediate(() => {
    console.log(2);
})

new Promise(resolve => {
    console.log(3);
    resolve()
    console.log(4);
})
.then(() => {
    console.log(5);
})

console.log(6);

process.nextTick(() => {
    console.log(7);
})

console.log(8);

/* 打印结果：
   3
   4
   6
   8
   7
   5
   1
   2
*/
```
首先毫无疑问，同步的代码一定是最先打印的，因此先打印的分别是 3 4 6 8      

再来判断一下异步的代码，setTimeout 被送入 timers queue ；setImmediate 被送入 check queue ；then() 被送入 other microtask queue ；process.nextTick 被送入 next tick queue      

然后我们按照上面图中的流程，首先检测到微队列中有待执行任务，并且我们说过，next tick queue 的优先级高于 other microtask queue，因此先打印了 7，然后打印了 5 ；到此为止微队列中的任务都被执行完了，接着就进入 timers queue 中阶段，所以打印了 1，当前阶段的队列为空了，按照顺序进入 poll 阶段，但发现队列为空，所以进入了 check 阶段，上面说过了这个阶段是专门处理 setImmediate 的，因此最后就打印了 2       


#### setTimeout和setImmediate

不知刚才讲了那么多，大家有没有发现，一个循环中，timers 阶段是先于 check 阶段的，那么是不是就意味着 setTimeout 就一定比 setImmediate 先执行呢？我们来看个例子    
``` js
setTimeout(() => {
    console.log('setTimeout');
}, 0)

setImmediate(() => {
    console.log('setImmediate');
})
```
我们用node运行该段代码多次，发现得到了如下两种结果：

``` js
// 第一种结果
setTimeout
setImmediate

// 第二种结果
setImmediate
setTimeout
```
这是为什么呢？    

这里我们给 setTimeout 设置的延迟时间是 0，表面上看上去好像是没有延迟，但其实运行起来延迟时间是大于0的    

然后node开启一个事件循环是需要一定时间的。假设node开启事件循环需要2毫秒，然后 setTimeout 实际运行的延迟时间是10毫秒，即事件循环开始得比 setTimeout 早，那么在第一轮事件循环运行到 timers 时，发现并没有 setTimeout 的回调需要执行，因此就进入了下一阶段，尽管此时 setTimeout 的延迟时间到了，但它只能在下一轮循环时被执行了，所以本次事件循环就先打印了 setImmediate，然后在下一次循环时打印了 setTimeout。      
 
这就是刚才第二种结果出现的原因    

那么为何存在第一种情况也就更好理解了，那就是 setTimeout 的实际的延迟事件小于node事件循环的开启事件，所以能在第一轮循环中被执行   


了解了为何出现上述原因以后，这里提出两个问题：

+ 如何能做到一定先打印 setTimeout ，后打印 setImmediate
+ 如何能做到一定先打印 setImmediate ，后打印 setTimeout

这里我们来分别实现一下这两个需求

##### 实现一
既然要让 setTimeout 先打印，那么就让它在第一轮循环时就被执行，那么我们只需要让事件循环开启的事件晚一点就好了。所以可以写一段同步的代码，让同步的代码执行事件长一点，然后就可以保证在进入 timers 阶段时，setTimeout 的回调已被送入 timers queue
``` js
setTimeout(() => {
    console.log('setTimeout');
}, 0)

setImmediate(() => {
    console.log('setImmediate');
})

let start = Date.now()
// 让同步的代码运行30毫秒
while(Date.now() - start < 30)
```
多次运行代码发现，每次都是先打印了 setTimeout，然后才打印的 setImmediate

##### 实现二
既然要让 setTimeout 后打印，那么就要想办法让它在第二轮循环时被执行，那么我们可以让 setTimeout 在第一轮事件循环跳过 timers 阶段后执行     

刚开始我们讲过，poll 阶段是为了处理各种 I/O 事件的，例如文件的读取就属于 I/O 事件，所以我们可以把 setTimeout 和 setImmediate 的代码放在一个文件读取操作的回调内，这样在第一轮循环到达 poll 阶段时，会将 setTimeout 送入 timers queue，但此时早已跳过了 timers 阶段，所以其只会在下一轮循环时被打印 ；同时 setImmediate 此时被送入了 check queue ，那么在离开 poll 阶段以后就可以顺利得先打印 setImmediate 了

``` js
const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('setTimeout');
  }, 0);
  setImmediate(() => {
    console.log('setImmediate');
  });
});
```

多次运行代码发现，每次都是先打印了 setImmediate，然后才打印的 setTimeout















