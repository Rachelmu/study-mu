
# typescript

1. 你觉得typescript和javascript有什么区别
2. typescript你都用过哪些类型
3. typescript中type和interface的区别
4. Ts 有什么优势- 讲道理所有现在在网上能查到的优势都是得益于**静态语言**的优势。


## 实现一个 Typescript 里的 Pick

+ type Pick<T, K extends keyof T> = { [P in K]: T[P] }

## type 和 interface 的区别

+ 这是一个高频题，如果考察 TS，这应该是最容易考察的，网上也都能查到相关的资料，但是很可能忽略一个点：**type 只是一个类型别名，并不会产生类型**。所以其实 type 和 interface 其实不是同一个概念，其实他们俩不应该用来比较的，只是有时候用起来看着类似。

##  ts 实现一个 redux