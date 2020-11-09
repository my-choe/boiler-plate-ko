const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',  // 클라이언트는 3000에서 보내더라도, 프록시가 서버5000으로 보내줌
      changeOrigin: true,
    })
  );
};