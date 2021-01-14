module.exports = {
  devServer: {
    host: 'localhost',
    port: '4000',
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api': '/'
        }
      },
    },
  }
}