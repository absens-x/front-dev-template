const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin");
const fs = require("fs");
const path = require("path");

module.exports = (env = {}) => {
  const { mode = "development" } = env;
  const IS_PROD = mode === "production";

  // console.log(IS_PROD, mode, env);

  const DIR_PATHS = {
    dist: path.resolve(__dirname, "dist"),
    src: path.resolve(__dirname, "src"),
  };

  const getStyleLoaders = () => {
    return [
      IS_PROD ? MiniCssExtractPlugin.loader : "style-loader",
      {
        loader: "css-loader",
        options: {
          sourceMap: true,
        },
      },
      {
        loader: "resolve-url-loader",
      },
      {
        loader: "postcss-loader",
        options: {
          sourceMap: true,
          config: { path: "postcss.config.js" },
        },
      },
    ];
  };

  const getPlugins = () => {
    const views = fs
      .readdirSync(`${DIR_PATHS.src}/views`)
      .filter((filename) => filename.endsWith(".pug"));

    const plugins = views.map((view) => {
      return new HtmlWebpackPlugin({
        template: `views/${view}`,
        title: `${view.replace(/\.pug/, "")}`,
        filename: `${DIR_PATHS.dist}/${view.replace(/\.pug/, ".html")}`,
      });
    });

    plugins.push(
      new CopyWebpackPlugin([
        { from: "img", to: "img" },
        { from: "fonts", to: "fonts" },
        { from: "assets", to: "assets" },
      ])
    );

    if (IS_PROD) {
      plugins.push(
        new CleanWebpackPlugin(),

        new MiniCssExtractPlugin({
          filename: "css/style.[contenthash].css",
        })
      );
    }

    return plugins;
  };

  return {
    context: DIR_PATHS.src,

    mode: mode,

    entry: {
      app: "./js/index.js",
    },

    output: {
      filename: IS_PROD ? "js/[name].[contenthash].js" : undefined,
      path: DIR_PATHS.dist,
      publicPath: IS_PROD ? undefined : "/",
    },

    module: {
      rules: [
        // JS

        {
          test: /\.js$/,
          exclude: "/node_modules",
          loader: "babel-loader",
        },

        // HTML

        {
          test: /\.pug$/,
          loader: "pug-loader",
        },

        // CSS

        {
          test: /\.css$/,
          use: getStyleLoaders(),
        },

        // SASS/SCSS

        {
          test: /\.(s[ca]ss)$/,
          use: [
            ...getStyleLoaders(),
            {
              loader: "sass-loader",
              options: { sourceMap: true },
            },
          ],
        },

        // Images
        {
          test: /\.(jpg|jpeg|png|gif|ico)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                outputPath: "img",
                name: "[name]-[sha1:hash:7].[ext]",
              },
            },
          ],
        },

        // Fonts
        {
          test: /\.(ttf|otf|eot|woff|woff2)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                outputPath: "fonts",
                name: "[name].[ext]",
              },
            },
          ],
        },
      ],
    },

    plugins: getPlugins(),

    devtool: IS_PROD ? false : "inline-source-map",

    devServer: {
      overlay: true,
    },
  };
};
