(window.webpackJsonp=window.webpackJsonp||[]).push([[34],{371:function(t,e,a){"use strict";a.r(e);var v=a(42),r=Object(v.a)({},(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"vue"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#vue"}},[t._v("#")]),t._v(" VUE")]),t._v(" "),a("ol",[a("li",[t._v("vue-router源码")]),t._v(" "),a("li",[t._v("vue原理（手写代码，实现数据劫持）")]),t._v(" "),a("li",[t._v("Object.defineProperty除了set get外还有什么属性，我回答了configurable enumerable")])]),t._v(" "),a("h2",{attrs:{id:"有用-ssr"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#有用-ssr"}},[t._v("#")]),t._v(" 有用 ssr")]),t._v(" "),a("p",[a("strong",[t._v("考虑过 Vue.js、React 这类的框架为什么要用 Virtual DOM 机制吗？")])]),t._v(" "),a("h2",{attrs:{id:"vue中的diff算法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#vue中的diff算法"}},[t._v("#")]),t._v(" vue中的diff算法")]),t._v(" "),a("h3",{attrs:{id:"原理-patchvnode是diff发生的地方-整体策略-深度优先-同层比较"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#原理-patchvnode是diff发生的地方-整体策略-深度优先-同层比较"}},[t._v("#")]),t._v(" 原理： （patchVnode是diff发生的地方，整体策略：深度优先，同层比较）")]),t._v(" "),a("ul",[a("li",[t._v("1.先同级比较，在比较子节点")]),t._v(" "),a("li",[t._v("2.先判断一方有儿子一方没儿子的情况")]),t._v(" "),a("li",[t._v("3.比较都有儿子的情况")]),t._v(" "),a("li",[t._v("4.递归比较子节点")])]),t._v(" "),a("h3",{attrs:{id:"总结"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#总结"}},[t._v("#")]),t._v(" 总结：")]),t._v(" "),a("ul",[a("li",[a("p",[t._v("1.diff算法是虚拟DOM技术的必然产物：通过新旧虚拟DOM作对比（即diff），将变化的地方更新在真实DOM上；另外，也需要diff高效的执行对比过程，从而降低时间复杂度为O(n)。")])]),t._v(" "),a("li",[a("p",[t._v("2.vue 2.x中为了降低Watcher粒度，每个组件只有一个Watcher与之对应，只有引入diff才能精确找到发生变化的地方。")])]),t._v(" "),a("li",[a("p",[t._v("3.vue中diff执行的时刻是组件实例执行其更新函数时，它会比对上一次渲染结果oldVnode和新的渲染结果newVnode，此过程称为patch。")])]),t._v(" "),a("li",[a("p",[t._v("4.diff过程整体遵循深度优先、同层比较的策略；两个节点之间比较会根据它们是否拥有子节点或者文本节点做不同操作；比较两组子节点是算法的重点，首先假设头尾节点可能相同做4次比对尝试，如果没有找到相同节点才按照通用方式遍历查找，查找结束再按情况处理剩下的节点；借助key通常可以非常精确找到相同节点，因此整个patch过程非常高效")])])])])}),[],!1,null,null,null);e.default=r.exports}}]);