const port = process.env.SERVER_PORT || '3001';

const proxyConfig = {
    "/api": {
        "target": `http://localhost:${port}`,
        "secure": true,
        "changeOrigin": true
    },
};

module.exports = proxyConfig;
