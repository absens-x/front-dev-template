module.exports = (env = {}) => {
	
	const { mode = "development" } = env;
	const isProd = mode === "production";

	const plugins = [
		require('autoprefixer'),
		require('@lipemat/css-mqpacker')({
			sort: true,
			preset: [
				'default', {
					discardComments: {
						removeAll: true
					}
				}
			]
		}),
	]

	if(isProd) {
		plugins.push(require('cssnano'))
	}
	
	return {
		plugins: plugins
	}
	
}
 