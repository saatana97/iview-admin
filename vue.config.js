module.exports = {
	outputDir: 'dist',
	assetsDir: 'manager-static',
	indexPath: 'manager.html',
	lintOnSave: 'error',
	devServer: {
		open: true,
		host: 'localhost',
		port: 8080,
		https: false,
		hotOnly: false,
		proxy: {
			'/api': {
				target: 'http://127.0.0.1:8888',
				changeOrigin: true,
				pathRewrite: {
					'^/api': '/satan-admin'
				}
			}
		},
		overlay: {
			warnings: true,
			errors: true
		},
		before: app => {}
	}
};
