module.exports = {
    themeConfig: {
        title: '阿木木',
        description: '阿木木的前端指南',
        base: '/docs/',
        logo: '/logo.png',
        head: [
          ['link', 
              { rel: 'icon', href: '/logo.png' }
              //浏览器的标签栏的网页图标，第一个'/'会遍历public文件夹的文件
          ],  
        ],
        // 添加导航栏
        nav: [{text: "主页", link: "/"},
          { text: "前端基础",
            items: [ 
              { text: "html", link:"/web/html/"},
              { text: "css", link:"/web/css/"},
              { text: "javascript", link:"/javaScript/"},
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
          { text: "算法", link: "/arithmetic/"},
          { text: "数据库", link: "/database/"},
          { text: "面试问题", link: "/interview/" }
        ],
        sidebar:{
            "/node/":[
              ["", "node目录"],
              ["path", "作为前端也需要知道的路径知识"],
              ["stream", "node核心模块-stream"]
            ],
            "/web/":[
              ["", "前端"],
              {
                title: "css",
                name: "css",
                collabsable: false,
                children: [
                  ["css/", "目录"],
                  ['css/1', "css常考面试题"]
                ]
              }
            ]
        }
    }
  }