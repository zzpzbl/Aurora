module.exports = {
  devServer: {
    host: 'localhost',
    port: '4000',
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api': '/'
        }
      },
    },
  }
}