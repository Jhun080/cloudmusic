module.exports = {
  publicPath: './',

  productionSourceMap: false,

  // 代理跨域
  devServer: {
    proxy: {
      '/api': {
        target: 'http://101.42.111.16:9416', // 目标服务器
        changOrigin: true, // 允许跨域
        pathRewrite: { // 路径重写
          '^/api': ''
        }
      }
    }
  }
}
