module.exports = {
    themeConfig: {
        logo: '/assets/img/logo.png',
        // 添加导航栏
        nav: [{text: "主页", link: "/"},
            { text: "node", link: "/node/"},
            { text: "http", link: "/http/"},
            { text: "前端", link: "/webframe/"},
            { text: "数据库", link: "/database/"},
            { text: "android", link: "/android/"},
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