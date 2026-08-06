module.exports = {
    lintOnSave: false, // 关闭语法检测
    // 浏览器标签页标题（注入 public/index.html 的 htmlWebpackPlugin.options.title）
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            title: 'problem-solving'
        }
    },
    // 开启代理服务器
    devServer: {
        host: '47.111.127.66', // 主机地址
        port: 8081, // 端口号
        // 代理服务器可以将路由中的指定前缀转发到指定的后端服务器中
        proxy: {
            '/api': {
                target: 'https://problem-solving.zqlyxz.com', // 2026-08: 域名已上线，经 Cloudflare 反代到源站后端
                ws: true, // 是否启用websockets
                changeOrigin: true,  // 代理时是否更改host
                pathRewrite: {
                    '^/api': '' //这里理解成用'/api'代替target里面的地址,比如我要调用'http://40.00.100.100:3002/user/add'，直接写'/api/user/add'即可
                }
            }
        }
    }
}
