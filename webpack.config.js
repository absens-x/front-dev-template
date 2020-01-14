const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin');
const fs = require('fs');
const path = require("path");

module.exports = (env = {}) => {
    
    const  { mode = "development" } = env;
    const isProd = mode === "production";
    
    const DIR_PATHS = {
        dist: path.resolve(__dirname, 'dist'),
        src: path.resolve(__dirname, 'src'),
    }

    const getStyleLoaders = () => {

        return [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            {
                loader: 'css-loader',
                options: {
                    sourceMap: true,
                }
            },
            {
                loader: 'resolve-url-loader',
            },
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true,
                    config: { path: 'postcss.config.js' }
                }
            }
            
        ]
    }

    const getPlugins = () => {
        
        const views = fs.readdirSync(`${DIR_PATHS.src}/views`).filter(filename => filename.endsWith('.pug'));

        const plugins = views.map(view => {
           return new HtmlWebpackPlugin({
                template: `src/views/${view}`,
                title: `${view.replace(/\.pug/, '')}`,
                filename: `${view.replace(/\.pug/, '.html')}`
            })
        });
        
        

        if(isProd) {
            plugins.push(
                new CleanWebpackPlugin(),
                
                new MiniCssExtractPlugin({
                    filename: 'css/style.[hash:10].css'
                }),

                new CopyWebpackPlugin([
                    { from: `${DIR_PATHS.src}/img`, to: 'img'},
                    { from: `${DIR_PATHS.src}/fonts`, to: 'fonts'},
                    { from: `${DIR_PATHS.src}/assets`, to: 'assets'},
                ])
            
            )
            
            // plugins.push(new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }))
        }

        return plugins;
    }


    
    return {
        

        mode: mode,

        output: {
            filename: isProd ? 'js/main-[hash:10].js' : undefined
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
                        ...getStyleLoaders(),
                        {
                            loader: 'sass-loader',
                            options: {sourceMap: true}
                        }
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

        devtool: 'source-map',
        
        devServer: {
            overlay: true,
            contentBase: DIR_PATHS.dist,
            publicPath: '/',
        },
        
        
    }
    
}