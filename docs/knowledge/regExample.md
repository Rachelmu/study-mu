# 正则案例

## 匹配时间
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

## 匹配日期
比如 yyyy-mm-dd 格式为例。

要求匹配: 2017-06-10

``` js
 var regex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/; 
 console.log( regex.test("2017-06-10") );
// => true
```

## 匹配id
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

## 字符串 trim 方法模拟
trim 方法是去掉字符串的开头和结尾的空白符。有两种思路去做。  

第一种，匹配到开头和结尾的空白符，然后替换成空字符。如:

```js
function trim(str) {
return str.replace(/^\s+|\s+$/g, '');
}
console.log( trim(" foobar ") ); // => "foobar"
```


第二种，匹配整个字符串，然后用引用来提取出相应的数据:   
``` js
function trim (str) {
return str.replace(/^\s*(.*?)\s*$/g, "$1");
}
console.log( trim(" foobar ") ); // => "foobar"
```

这里使用了惰性匹配` *?`，不然也会匹配最后一个空格之前的所有空格的。 当然，前者效率高。

## 将每个单词的首字母转换为大写
``` js
function titleize (str) {
	return str.toLowerCase().replace(/(?:^|\s)\w/g, function (c) {
		return c.toUpperCase(); 
	});
}
console.log( titleize('my name is epeli') ); // => "My Name Is Epeli"
```
思路是找到每个单词的首字母，当然这里不使用非捕获匹配也是可以的。

## 驼峰化
``` js
function camelize (str) {
return str.replace(/[-_\s]+(.)?/g, function (match, c) {
return c ? c.toUpperCase() : ''; });
}
console.log( camelize('-moz-transform') ); // => "MozTransform"
```

其中分组 (.) 表示首字母。单词的界定是，前面的字符可以是多个连字符、下划线以及空白符。正则后面
的 ? 的目的，是为了应对 str 尾部的字符可能不是单词字符，比如 str 是 '-moz-transform '。

## 中划线化
```js
function dasherize (str) {
return str.replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
}
console.log( dasherize('MozTransform') ); // => "-moz-transform"
```
驼峰化的逆过程。

## HTML 转义和反转义
``` js
// 将HTML特殊字符转换成等值的实体 
function escapeHTML (str) {
      var escapeChars = {
        '<' : 'lt',
        '>' : 'gt',
        '"' : 'quot',
'&' : 'amp',
        '\'' : '#39'
      };
return str.replace(new RegExp('[' + Object.keys(escapeChars).join('') +']', 'g'), function (match) {
          return '&' + escapeChars[match] + ';';
      });
}
console.log( escapeHTML('<div>Blah blah blah</div>') ); // => "&lt;div&gt;Blah blah blah&lt;/div&gt";
```
其中使用了用构造函数生成的正则，然后替换相应的格式就行了，这个跟本章没多大关系。    
倒是它的逆过程，使用了括号，以便提供引用，也很简单，如下:
``` js
// 实体字符转换为等值的HTML。 
function unescapeHTML (str) {
      var htmlEntities = {
        nbsp: ' ',
        lt: '<',
        gt: '>',
        quot: '"',
        amp: '&',
        apos: '\''
};
return str.replace(/\&([^;]+);/g, function (match, key) {
          if (key in htmlEntities) {
              return htmlEntities[key];
}
          return match;
      });
}
console.log( unescapeHTML('&lt;div&gt;Blah blah blah&lt;/div&gt;') ); // => "<div>Blah blah blah</div>"
```
通过 key 获取相应的分组引用，然后作为对象的键。

## 匹配成对标签

要求匹配:   
  `<title>regular expression</title>`   
  `<p>laoyao bye bye</p>`   
不匹配:    
  `<title>wrong!</p>`   
匹配一个开标签，可以使用正则 `<[^>]+>`， 匹配一个闭标签，可以使用 `<\/[^>]+>`，    
但是要求匹配成对标签，那就需要使用反向引用，如:
```js
 var regex = /<([^>]+)>[\d\D]*<\/\1>/;
var string1 = "<title>regular expression</title>"; var string2 = "<p>laoyao bye bye</p>";
var string3 = "<title>wrong!</p>";
console.log( regex.test(string1) ); // true 
console.log( regex.test(string2) ); // true 
console.log( regex.test(string3) ); // false
```
其中开标签 `<[\^>]+>` 改成 `<([^>]+)>`，使用括号的目的是为了后面使用反向引用， 而提供分组。闭标签使用了反向引用，`<\/\1>`。
另外，`[\d\D]`的意思是，这个字符是数字或者不是数字，因此，也就是匹配任意字符的意思。

## 身份证匹配
``` js
/^(\d{15}|\d{17}[\dxX])$/
// 因为竖杠 | 的优先级最低，所以正则分成了两部分 \d{15} 和 \d{17}[\dxX]。 \d{15} 表示 15 位连续数字。
// \d{17}[\dxX] 表示 17 位连续数字，最后一位可以是数字，可以大小写字母 "x"。
```

## IPV4 地址
``` js
/^((0{0,2}\d|0?\d{2}|1\d{2}|2[0-4]\d|25[0-5])\.){3}(0{0,2}\d|0?\d{2}|1\d{2}|2[0-4]\d|25[0-5])$/
```
这个正则，看起来非常吓人。但是熟悉优先级后，会立马得出如下的结构:     
`((...)\.){3}(...)`    
其中，两个 (...) 是一样的结构。表示匹配的是 3 位数字。因此整个结构是 3位数.3位数.3位数.3位数    
然后再来分析 (...): `(0{0,2}\d|0?\d{2}|1\d{2}|2[0-4]\d|25[0-5])` 它是一个多选结构，分成5个部分:    
+ `0{0,2}\d`，匹配一位数，包括 "0" 补齐的。比如，"9"、"09"、"009"; 
+ `0?\d{2}`，匹配两位数，包括 "0" 补齐的，也包括一位数;
+ `1\d{2}`，匹配 "100" 到 "199";
+ `2[0-4]\d`，匹配 "200" 到 "249";
+ `25[0-5]`，匹配 "250" 到 "255"。



## 题目
### 1、var s1 = "get-element-by-id"; 给定这样一个连字符串，写一个function转换为驼峰命名法形式的字符串 getElementById
``` js
var f = function(s) {
    return s.replace(/-\w/g, function(x) {
        return x.slice(1).toUpperCase();
    })
}
function camelize (str) {
	return str.replace(/[-_\s]+(.)?/g, function (match, c) {
	return c ? c.toUpperCase() : ''; 
	});
}
```

### 2、判断字符串是否包含数字
``` js
function containsNumber(str) {
    var regx = /\d/;
    return regx.text(str);
}
```

### 3、判断电话号码
``` js
function isPhone(tel) {
    var regx = /^1[34578]\d{9}$/;
    return regx.test(tel);
}
```

### 4、判断是否符合指定格式

给定字符串str，检查其是否符合如下格式   

+ XXX-XXX-XXXX   
+ 其中X为Number类型

``` js
function matchesPattern(str) {
    return /^(\d{3}-){2}\d{4}&/.test(str);
}
```

### 5、判断是否符合USD格式   
给定字符串 str，检查其是否符合美元书写格式   

1.以 $ 开始   
2.整数部分，从个位起，满 3 个数字用 , 分隔   
3.如果为小数，则小数部分长度为 2   
4.正确的格式如：$1,023,032.03 或者 $2.03，错误的格式如：$3,432,12.12 或者 $34,344.3**   
``` js
function isUSD(str) {
    var regx = /^\$\d{1,3}(,\d{3})*(\.\d{2})?$/;
    return regx.test(str);
}
```

### 6、JS实现千位分隔符
``` js
function format(number) {
    var regx = /\d{1,3}(?=(\d{3})+$)/g;
    return (number + '').replace(regx, '$&,')  // $&表示与regx相匹配的字符串
}
```

### 7、获取 url 参数

获取 url 中的参数   

1.指定参数名称，返回该参数的值 或者 空字符串
2.不指定参数名称，返回全部的参数对象 或者 {}
3.如果存在多个同名参数，则返回数组
``` js
function getUrlParam(url, key) {
    var arr = {};
    url.replace(/\??(\w+)=(\w+)&?/g, function(match, matchKey, matchValue) {
       if (!arr[matchKey]) {
           arr[matchKey] = matchValue;
       } else {
           var temp = arr[matchKey];
           arr[matchKey] = [].concat(temp, matchValue);
       }
    });
    if (!key) {
        return arr;
    } else {
        for (ele in arr) {
            if (ele = key) {
                return arr[ele];
            }
        }
        return '';
    }
}

```

### 8、验证邮箱
``` js
function isEmail(email) {
    var regx = /^([a-zA-Z0-9_\-])+@([a-zA-Z0-9_\-])+(\.[a-zA-Z0-9_\-])+$/;
    return regx.test(email);
}
```

### 9、验证身份证号码

身份证号码可能为15位或18位，15位为全数字，18位中前17位为数字，最后一位为数字或者X
``` js
function isCardNo(number) {
    var regx = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return regx.test(number);
}
```

### 10、匹配汉字
``` js
var regx = /^[\u4e00-\u9fa5]{0,}$/;
```

### 11、去除首尾的'/'
``` js
var str = '/asdf//';
str = str.replace(/^\/*|\/*$/g, '');
```

### 12、判断日期格式是否符合 '2017-05-11'的形式，简单判断，只判断格式
``` js
var regx = /^\d{4}\-\d{1,2}\-\d{1,2}$/
```

### 13、判断日期格式是否符合 '2017-05-11'的形式，严格判断（比较复杂）
``` js
var regx = /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;
```

### 14、IPv4地址正则
``` js
var regx = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
```

### 15、十六进制颜色正则
``` js
var regx = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
```

### 16、车牌号正则
``` js
var regx = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
```

### 17、过滤HTML标签
``` js
var str="<p>dasdsa</p>nice <br> test</br>"
var regx = /<[^<>]+>/g;
str = str.replace(regx, '');
```

### 18、密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
``` js
var regx = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/;
```

### 19、URL正则
``` js
var regx = /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
```

### 20、匹配浮点数
``` js
var regx = /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/;
```

### 21、`<OPTION value="待处理">`待处理`</OPTION>`

写一个正则表达式,匹配 `"<OPTION value="待处理">"`
``` js
var str = '<OPTION value="待处理">待处理</OPTION>';
var regx = /^<.*?>/;
var resiult = regx.exec(str)[0];

```
