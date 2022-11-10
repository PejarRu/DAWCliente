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
    // ENABLE DEV MODE
    mode: 'development' ,
    // ENTRY POINTS FOR MULTIPLE PAGES WITH .JS FOR EACH
    context: path.join(__dirname, './src'),
    entry: {
        index: "./index.js",
        "new-product": "./new-product.js",
    },
    // SET OUTPUT FILES
    output: {
        filename: "[name].bundle.js",
        path: path.join(__dirname + "./dist"),
        publicPath: "/dist/",
        // GENERATE dist/index.bundle.js dist/new-product.bundle.js
        // REMEMBER TO CHANGE IN .HTML
    },
    // SET CSS LOADER
    // REMEMBER TO CHANGE INDEX.HTML AND JS 
    plugins: [
        new MiniCssExtractPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    }
};