const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require("path");

module.export = ({ mode = "development"}) => {
    
    const isProd = mode === "production";
    const isDev = mode === "development";
    const PATHS = {
        dist: path.resolve(__dirname, 'dist'),
        src: path.resolve(__dirname, 'src'),
    }

    const getStyleLoaders = () => {

        return [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true,
                    config: { path: 'postcss.config.js' }
                }
            },
            'css-loader'
        ]
    }

    const getPlugins = () => {
        const plugins = [
            new HtmlWebpackPlugin({
                template: 'src/views/index.pug',
                title: "Home",
                filename: 'dist/index.html'
            })
        ]

        if(isProd) {
            plugins.push(new MiniCssExtractPlugin({
                filename: 'style.[hash:10].css'
            }))
        }

        return plugins;
    }


    
    return {
        mode: mode,

        output: {
            filename: isProd ? 'main-[hash:10].js' : undefined
        },

        module: {
            rules: [
                
                // JS
                
                {
                    test: /\.js$/,
                    exclude: "/node_modules",
                    loader: 'babel-loader'
                },

                // HTML

                {
                    test: /\.pug$/,
                    loader: 'pug-loader'
                },

                // CSS

                {
                    test: /\.css$/,
                    use: getStyleLoaders()
                },

                // SASS/SCSS

                {
                    test: /\.(s[ca]ss)$/,
                    use: [
                        ...getStyleLoaders(), 'sass-loader'
                    ]
                },

                // Images
                {
                    test: /\.(jpg|jpeg|png|gif|ico)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            outputPath: "img",
                            name: '[name]-[sha1:hash:7].[ext]'
                        }
                    }]
                },

                // fonts
                {
                    test: /\.(ttf|otf|eot|woff|woff2)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            outputPath: "fonts",
                            name: '[name].[ext]'
                        }
                    }]
                }
            ]
        },

        plugins: getPlugins(),
    }
    
}