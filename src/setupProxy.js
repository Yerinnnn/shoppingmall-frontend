const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxy Request:', {
          method: req.method,
          path: req.path,
          body: req.body
        });
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('Proxy Response:', {
          status: proxyRes.statusCode,
          headers: proxyRes.headers
        });
      },
      onError: (err, req, res) => {
        console.error('Proxy Error:', err);
      }
    })
  );
};