const path = require('path');
// ADD CSSLOADER
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    devServer: {
        static: __dirname, // Server’s root dir
        compress: true, // Enable gzip compresion when serving content
        port: 8080, // Default
        hot: false
    },
    mode: 'development' ,
    context: path.join(__dirname, './src'),
    entry: {
        index: "./index.js",
        "new-product": "./new-product.js",
    },
    output: {
        filename: "[name].bundle.js",
        path: path.join(__dirname + "./dist"),
        publicPath: "/dist/",
    },
    plugins: [
        new MiniCssExtractPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            // ADD HANDLEBARS LOADER
            { 
                test: /\.hbs$/, 
                loader: "handlebars-loader" 
            }
        ]
    }
};