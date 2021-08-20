module.exports={
    proxy: {
        '/api': {
            // target: 'http://192.168.131.89:8082/',
            // target: 'http://192.168.111.191:8081/',
            // target: 'http://192.168.111.191:8082/',
            // target: 'http://192.168.131.89:8081/',
            target:'https://api.github.com',
            pathRewrite:{'^/api':''},
            changeOrigin:true
            // target: 'http://192.168.131.89:8082/'
        }
    }
}