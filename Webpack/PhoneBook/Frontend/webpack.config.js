const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
    entry: "./js/phoneBookVueServer.js",

    devtool: "source-map",

    target: ["web", "es5"],

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
                use: [
                    MiniCssExtractPlugin.loader, "css-loader", "sass-loader"
                ]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader, "css-loader"
                ]
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
        new VueLoaderPlugin()
    ],

    devServer: {
        hot: true,
        open: true
    }
}