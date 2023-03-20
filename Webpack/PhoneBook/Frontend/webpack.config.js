const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => ({
    entry: "./js/phoneBookVueServer.js",

    devtool: "source-map",

    target: argv.mode === "development" ? ["web"] : ["web", "es5"],

    output: {
        filename: "phoneBookVueServer.js",
        path: path.resolve(__dirname, "..", "public")
    },

    resolve: {
        alias: {
            "vue$": "vue/dist/vue"
        }
    },

    module: {
        rules: [
            {
                test: /\.scss$/,
                use: argv.env.WEBPACK_SERVE
                    ? ["style-loader", "css-loader", "sass-loader"]
                    : [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            },
            {
                test: /\.css$/,
                use: argv.env.WEBPACK_SERVE 
                    ? ["style-loader", "css-loader"] 
                    : [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.(png|jpg|gif|svg|ttf|eot|woff|woff2)$/,
                type: "asset/resource"
            },
            {
                test: /\.js$/,

                exclude: /node_modules/,

                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            },
            {
                test: /\.vue$/,
                use: "vue-loader"
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "phoneBookVueServer.css"
        }),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: "index.html"
        })
    ],

    devServer: {
        hot: true,
        open: true,
        proxy: {
            '/api': 'http://localhost:3000'
        }
    }
});