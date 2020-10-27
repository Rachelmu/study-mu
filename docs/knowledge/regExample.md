# 正则案例

## 案例分析
### 匹配时间
以 24 小时制为例。
要求匹配:  23:59

分析:
共 4 位数字，第一位数字可以为 [0-2]。  
当第 1 位为 "2" 时，第 2 位可以为 [0-3]，其他情况时，第 2 位为 [0-9]。 第 3 位数字为 [0-5]，第4位为 [0-9]。

``` js
var regex = /^([01][0-9]|[2][0-3]):[0-5][0-9]$/; console.log( regex.test("23:59") );
console.log( regex.test("02:07") );
// => true
// => true
// 
// 如果也要求匹配 "7:9"，也就是说时分前面的 "0" 可以省略。
ar regex = /^(0?[0-9]|1[0-9]|[2][0-3]):(0?[0-9]|[1-5][0-9])$/; console.log( regex.test("23:59") );
console.log( regex.test("02:07") );
console.log( regex.test("7:9") );
  // => true
  // => true
  // => true
```
正则中使用了 ^ 和 $，分别表示字符串开头和结尾。

### 匹配日期
比如 yyyy-mm-dd 格式为例。

要求匹配: 2017-06-10

``` js
 var regex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/; 
 console.log( regex.test("2017-06-10") );
// => true
```

### 匹配id
要求从
``` html
<div id="container" class="main"></div>
```
提取出 id="container"。 可能最开始想到的正则是:

``` js
var regex = /id=".*"/
var string = '<div id="container" class="main"></div>'; console.log(string.match(regex)[0]);
// => id="container" class="main"

```

因为 . 是通配符，本身就匹配双引号的，而量词 * 又是贪婪的，当遇到 container 后面双引号时，是不会 停下来，会继续匹配，直到遇到最后一个双引号为止。
解决之道，可以使用惰性匹配:

``` js
var regex = /id=".*?"/
var string = '<div id="container" class="main"></div>'; console.log(string.match(regex)[0]);
// => id="container"
```

当然，这样也会有个问题。效率比较低，因为其匹配原理会涉及到“回溯”这个概念。可以优化如下:

``` js
var regex = /id="[^"]*"/
var string = '<div id="container" class="main"></div>'; console.log(string.match(regex)[0]);
// => id="container"
```

### 字符串 trim 方法模拟


## 题目

### 1、var s1 = "get-element-by-id"; 给定这样一个连字符串，写一个function转换为驼峰命名法形式的字符串 getElementById
``` js
var f = function(s) {
    return s.replace(/-\w/g, function(x) {
        return x.slice(1).toUpperCase();
    })
}
```