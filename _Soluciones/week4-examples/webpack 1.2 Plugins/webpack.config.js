const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// ADD HTMLPLUGIN
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devServer: {
        /* CHANGE SERVER ROOT TO DIST TO LOAD HTML CREATED BY PLUGIN
        static: __dirname, 
        */
        static:  path.join(__dirname, 'dist'),
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
        /* CHANGE OUTPUT PATH BECAUSE NOW SERVER STARTS IN DIST
        publicPath: "/dist/",
        */
        publicPath: "/",
    },
    plugins: [
        new MiniCssExtractPlugin(),
        // ADD HTML PLUGIN
        // NOW YOU CAN REMOVE IT FROM HTML FILES
        new HtmlWebpackPlugin({
            //filename not necessary. By default generates index.html
            template: "../index.html", // .. because it will create the file in /dist. File is in root
            chunks: ["index", "commons", "vendors"], // scripts to include
        }), 
        new HtmlWebpackPlugin({
            filename: "new-product.html",
            template: "../new-product.html",
            chunks: ["new-product", "commons"],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            { 
                test: /\.hbs$/, 
                loader: "handlebars-loader" 
            }
        ]
    },
    // INCLUDE SPLITCHUNKS
    // REMEMBER TO INCLUDE CHUNKS IN .HTML
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test(module) {
                        return module.resource && module.resource.includes('/node_modules');
                    },
                name: "vendors",
                chunks: "all",
                },
                commons: {
                    test(module) {
                        return module.resource && !module.resource.includes('/node_modules');
                    },
                chunks: "initial",
                name: "commons",
                minChunks: 2,
                minSize: 0,
                },
            },
        },
    }
};