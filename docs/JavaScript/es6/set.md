#Set

### 算法
####相等比较算法
- The Abstract Equality Comparison Algorithm (==)
- The Strict Equality Comparison Algorithm (===)
- SameValue (Object.is())
- SameValueZero (暂未提供API)


#### SameValue
对于前端研发来说，== 和 === 比较算法肯定已经深入了解了。

对于熟练使用ES6的小伙伴，多知道Object.is()这个方法：

##### Object.is()
- Object.is() 方法判断两个值是否为同一个值。 
```js
Object.is(NaN, NaN) // true
Object.is(0, -0) // false
```
而Object.is内部采用的比较算法就是SameValue(x, y)，而它与 === 的区别也正是这两种情况。

#### SameValueZero
``` js
  const s = new Set()
  s.add(0)
  s.add(NaN)
  s.has(-0) // true
  s.has(NaN) // true
```
- 是不是与上述的三种算法的表现多不一样，这就是第四种比较算法SameValueZero，它与SameValue的区别主要在于0与-0是否相等。
#### includes内部使用的比较算法就是SameValueZero
``` js
    const a = [0, NaN]
    a.includes(-0) // true
    a.includes(NaN) // true
```