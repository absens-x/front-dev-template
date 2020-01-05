module.exports = {
	plugins: [
		require('autoprefixer'),
		require('cssnano'),
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
}
 