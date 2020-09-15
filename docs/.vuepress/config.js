module.exports = {
    title: '阿木木的前端笔记',
    description: '阿木木的前端指南',
    base: '/study-mu/',
    head: [
      ['link', 
          { rel: 'icon', href: '/logo.png' }
          //浏览器的标签栏的网页图标，第一个'/'会遍历public文件夹的文件
      ],  
    ],
    themeConfig: {
        logo: '/logo.png',
        // 添加导航栏
        nav: [{text: "主页", link: "/"},
          { text: "前端基础",
            items: [ 
              { text: "html", link:"/web/html/"},
              { text: "css", link:"/web/css/"},
              { text: "javascript", link:"/javaScript/js/"},
              { text: "es6", link:"/javaScript/es6/"},
            ]
          },
          { text: "前端框架",
            items: [ 
              { text: "vue", link:"/frame/vue/"},
              { text: "react", link:"/frame/react/"},
            ]
          },
          { text: "TypeScript", link: "/TypeScript/"},
          { text: "node", link: "/node/"},
          { text: "http", link: "/http/"},
          { text: "数据结构与算法", link: "/arithmetic/"},
          { text: "前端工程化", link: "/engineering/"},
          { text: "面试问题", link: "/interview/" },
          { text: "前端知识库", link: "/knowledge/" }
        ],
        // sidebar: 'auto'
        sidebar:{
              '/web/css/':[
              '',  /* css */
              'flex', /* /web/css/flex.html */
            ],
            '/javaScript/js/': [
              '',      /* JS */
              'function', /* /javaScript/js/function.html */
              'jsSixAcrobatics', /* /javaScript/js/jsSixAcrobatics.html */

            ],
            '/javaScript/es6/': [
              '',      /* es6 */
              'es6Base', /* /javaScript/es6/es6Base.html */

            ],
            '/frame/vue/': [
              '',      /* Vue */
              'VueDes', /* /frame/vue/VueDes.html */
              'VueBase', /* /frame/vue/VueBase.html */
              'VueComponents', /* /frame/vue/VueComponents.html */
              'VueTemplate', /* /frame/vue/VueTemplate.html */
              'VueTheory',  /* /frame/vue/VueTheory.html */
              'VueKeepAlive',  /* /frame/vue/VueKeepAlive.html */
              'VueAnalysis', /* /frame/vue/VueAnalysis.html */
              'Vuex'   /* /frame/vue/Vuex.html */
            ],
            '/interview/': [
              '',      /* JS */
              'html', /* /interview/html.html */
              'css', /* /interview/css.html */
              'js', /* /interview/js.html */
              'jsHigh', /* /interview/jsHigh.html */
              'es6', /* /interview/es6.html */
              'TypeScript', /* /interview/TypeScript.html */
              'vue', /* /interview/vue.html */
              'react', /* /interview/react.html */
              'node', /* /interview/node.html */
              'arithmetic', /* /interview/arithmetic.html */
              'performance', /* /interview/performance.html */
            ],
              // fallback
            '/': [
              '',        /*  */
              'contact', /* contact.html */
              'about'    /* about.html */
            ]
        }
    }
  }