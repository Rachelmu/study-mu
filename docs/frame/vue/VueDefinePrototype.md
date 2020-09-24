# Vue 响应式原理

## Object.definePrototype

## 数据不响应解决方法

``` vue
<template>
  <div>
    <div>
      <span>用户名: {{ userInfo.name }}</span>
      <span>用户性别: {{ userInfo.sex }}</span>
      <span v-if="userInfo.officialAccount">
        公众号: {{ userInfo.officialAccount }}
      </span>
    </div>
    <button @click="handleAddOfficialAccount">添加公众号</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: {
        name: '子君',
        sex: '男'
      }
    }
  },
  methods: {
    // 在这里添加用户的公众号
    handleAddOfficialAccount() {
      this.userInfo.officialAccount = '前端有的玩'
    }
  }
}
</script>

```
在上面的代码中，我们希望给用户信息里面添加公众号属性，但是通过this.userInfo.officialAccount = '前端有的玩' 添加之后，并没有生效，这是为什么呢？  

这是因为在Vue内部，数据响应是通过使用Object.definePrototype监听对象的每一个键的getter,setter方法来实现的，但通过这种方法只能监听到已有属性，新增的属性是无法监听到的。那么如何让他响应到呢？让我们一起往下看。

### 一、将本来要新增的属性提前在data中定义好
比如上面的公众号，我可以提前在userInfo里面定义好，这样就不是新增属性了，就像下面这样

``` js
data() {
    return {
      userInfo: {
        name: '子君',
        sex: '男',
        // 我先提前定义好
        officialAccount: ''
      }
    }
  }

```

### 二、直接替换掉userInfo

虽然无法给userInfo里面添加新的属性，但是因为userInfo已经定义好了，所以我直接修改userInfo的值不就可以了么，所以也可以像下面这样写

```js
this.userInfo = {
  // 将原来的userInfo 通过扩展运算法复制到新的对象里面
  ...this.userInfo,
  // 添加新属性
  officialAccount: '前端有的玩'
}

```

### 三、使用Vue.set
其实上面两种方法都有点取巧的嫌疑，其实对于新增属性，Vue官方专门提供了一个新的方法Vue.set用来解决新增属性无法触发数据响应。

#### Vue.set 方法定义

``` js
/**
* target 要修改的对象
* prpertyName 要添加的属性名称
* value 要添加的属性值
*/
Vue.set( target, propertyName, value )

```
上面的代码使用Vue.set可以修改为

``` js
import Vue from 'vue'

// 在这里添加用户的公众号
handleAddOfficialAccount() {
  Vue.set(this.userInfo,'officialAccount', '前端有的玩')
}
````
但是每次要用到set方法的时候，还要把Vue引入进来，好麻烦，所以为了简便起见，Vue又将set方法挂载到了Vue的原型链上了，即Vue.prototype.$set = Vue.set,所以在Vue组件内部可以直接使用this.$set代替Vue.set

``` js
this.$set(this.userInfo,'officialAccount', '前端有的玩')
```

只有当你要赋值的属性还没有定义的时候需要使用Vue,set，其他时候一般不会需要使用。

### 四、使用$forceUpdate
我觉得$forceUpdate的存在，让许多前端开发者不会再去注意数据双向绑定的原理，因为不论什么时候，反正我修改了data之后，调用一下$forceUpdate就会让Vue组件重新渲染，bug是不会存在的。但是实际上这个方法并不建议使用，因为它会引起许多不必要的性能消耗

## 数组的响应式原理
实际上，如果Vue仅仅依赖getter与setter，是无法做到在数组调用push,pop等方法时候触发数据响应的，因此Vue实际上是通过劫持这些方法，对这些方法进行包装变异来实现的。  
Vue对数组的以下方法进行的包装变异:  

- push
- pop
- shift
- unshift
- splice
- sort
- reverse

所以在操作数组的时候，调用上面这些方法是可以保证数据可以正常响应，下面是Vue源码中包装数组方法的代码:
``` js
var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    // 将 arguments 转换为数组
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];
    var result = original.apply(this, args);
    // 这儿的用法同dependArray(value)，就是为了取得dep
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    // 如果有新的数据插入，则插入的数据也要进行一个响应式
    if (inserted) { ob.observeArray(inserted); }
   // 通知依赖进行更新
    ob.dep.notify();
    return result
  });
```

## 数组不响应解决

其实不仅仅是对象，数组也存在数据修改之后不响应的情况，比如下面这段代码

``` vue
<template>
  <div>
    <ul>
      <li v-for="item in list" :key="item">
        {{ item }}
      </li>
    </ul>
    <button @click="handleChangeName">修改名称</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: ['张三', '李四']
    }
  },
  methods: {
    // 修改用户名称
    handleChangeName() {
      this.list[0] = '王五'
    }
  }
}
</script>


```

上面的代码希望将张三的名字修改为王五，实际上这个修改并不能生效，这是因为Vue不能检测到以下变动的数组:

1.当你利用索引直接设置一个项时，例如: this.list[index] = newValue  
2.修改数组的length属性,例如: this.list.length = 0

所以在上例中通过this.list[0] = '王五' 是无法触发数据响应的，那应该怎么办呢？像上面提到的Vue.set和$forceUpdate都可以解决这个问题，比如Vue.set可以这样写。

``` js
Vue.set(this.list,0,'王五')
```

除了那些方法之外，Vue还针对数组提供了变异方法

在操作数组的时候，我们一般会用到数据提供的许多方法，比如push,pop,splice等等，在Vue中调用数组上面提供的这些方法修改数组的值是可以触发数据响应的，比如上面的代码改为以下代码即可触发数据响应  

``` js
this.list.splice(0,1,'王五')
```









