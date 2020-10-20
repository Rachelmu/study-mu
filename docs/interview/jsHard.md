#  Javascript 变态题解析

## 第1题
``` js
["1", "2", "3"].map(parseInt)
```
首先, map接受两个参数, 一个回调函数 callback, 一个回调函数的this值

其中回调函数接受三个参数 currentValue, index, arrary;

而题目中, map只传入了回调函数--parseInt.

其次, parseInt 只接受两个两个参数 string, radix(基数).

>在没有指定基数，或者基数为 0 的情况下，JavaScript 作如下处理：
> - 如果字符串 string 以"0x"或者"0X"开头, 则基数是16 (16进制).
> - 如果字符串 string 以"0"开头, 基数是8（八进制）或者10（十进制），那么具体是哪个基数由实现环境决- 定。ECMAScript 5 规定使用10，但是并不是所有的浏览器都遵循这个规定。因此，永远都要明确给出radix参数的值。
> - 如果字符串 string 以其它任何值开头，则基数是10 (十进制)。

所以本题即问
``` js
parseInt('1', 0);
parseInt('2', 1);
parseInt('3', 2);
```
首先后两者参数不合法.

::: tip 所以答案是
[1, NaN, NaN]
:::


## 第2题
``` js
[typeof null, null instanceof Object]
```
typeof 返回一个表示类型的字符串.

instanceof 运算符用来检测 constructor.prototype 是否存在于参数 object 的原型链上.

这个题可以直接看链接... 因为 typeof null === 'object' 自语言之初就是这样....

typeof 的结果请看下表:
``` js
type         result
Undefined   "undefined"
Null        "object"
Boolean     "boolean"
Number      "number"
String      "string"
Symbol      "symbol"
Host object Implementation-dependent
Function    "function"
Object      "object"
```
::: tip 所以答案是
所以答案 [object, false]

:::


## 第3题
``` js
[ [3,2,1].reduce(Math.pow), [].reduce(Math.pow) ]
```
arr.reduce(callback[, initialValue])

reduce接受两个参数, 一个回调, 一个初始值.

回调函数接受四个参数 previousValue, currentValue, currentIndex, array
Accumulator (acc) (累计器)
Current Value (cur) (当前值)
Current Index (idx) (当前索引)
Source Array (src) (源数组)

需要注意的是 If the array is empty and no initialValue was provided, TypeError would be thrown.

Math.pow() 函数返回基数（base）的指数（exponent）次幂，即 baseexponent。

所以第二个表达式会报异常. 第一个表达式等价于 Math.pow(3, 2) => 9; Math.pow(9, 1) =>9

::: tip 所以答案是
答案 an error
:::

## 第4题
``` js
var val = 'smtg';
console.log('Value is ' + (val === 'smtg') ? 'Something' : 'Nothing');
```
简而言之 + 的优先级 大于 ?

所以原题等价于 'Value is true' ? 'Somthing' : 'Nonthing' 而不是 'Value is' + (true ? 'Something' : 'Nonthing')

::: tip 所以答案是
答案 'Something'
:::

## 第5题
``` js
var name = 'World!';
(function () {
    if (typeof name === 'undefined') {
        var name = 'Jack';
        console.log('Goodbye ' + name);
    } else {
        console.log('Hello ' + name);
    }
})();
```
在 JavaScript中， functions 和 variables 会被提升。变量提升是JavaScript将声明移至作用域 scope (全局域或者当前函数作用域) 顶部的行为。

这个题目相当于
``` js
var name = 'World!';
(function () {
    var name;
    if (typeof name === 'undefined') {
        name = 'Jack';
        console.log('Goodbye ' + name);
    } else {
        console.log('Hello ' + name);
    }
})();
```

::: tip 所以答案是
所以答案是 'Goodbye Jack'
:::

## 第1题
``` js
```
::: tip 所以答案是

:::

## 第1题
``` js
```
::: tip 所以答案是

:::

## 第1题
``` js
```
::: tip 所以答案是

:::

## 第1题
``` js
```
::: tip 所以答案是

:::

## 第1题
``` js
```
::: tip 所以答案是

:::

## 第1题
``` js
```
::: tip 所以答案是

:::

## 第1题
``` js
```
::: tip 所以答案是

:::

## 第1题
``` js
```
::: tip 所以答案是

:::

## 第1题
``` js
```
::: tip 所以答案是

:::

## 第1题
``` js
```
::: tip 所以答案是

:::

## 第1题
``` js
```
::: tip 所以答案是

:::

## 第1题
``` js
```
::: tip 所以答案是

:::

## 第1题
``` js
```
::: tip 所以答案是

:::