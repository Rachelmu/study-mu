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
              { text: "javascript", link:"/javaScript/"},
              { text: "es6", link:"/javaScript/es6"},
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
          { text: "面试问题", link: "/interview/" }
        ],
        // sidebar: 'auto'
        sidebar:{
            // "/web/css":[
            //   ["", "css基础"],
            //   {
            //     title: "css",
            //     name: "css",
            //     collabsable: false,
            //     children: [
            //       ["css/", "目录"],
            //       ['css/', "css常考面试题"]
            //     ]
            //   }
            // ],
            // "/web/html":[
            //   ["", "html"],
            //   {
            //     title: "css",
            //     name: "css",
            //     collabsable: false,
            //     children: [
            //       ["css/", "目录"],
            //       ['css/1', "css常考面试题"]
            //     ]
            //   }
            // ]
            'javaScript':[
              'es6'
            ]
        }
    }
  }