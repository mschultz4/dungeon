var path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
    template: __dirname + '/src/index.html',
    filename: 'index.html',
    inject: 'body'
});

module.exports = {
    entry: "./src/dungeon.js",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js"
    },
    externals: {
        react: "React",
        "react-dom": "ReactDOM"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: ["babel"],
            query: {
                presets: ['es2015', 'react']
            }

        }, {
            test: /\.css$/,
            loader: "style-loader!css-loader"
        }]
    },
    plugins: [HTMLWebpackPluginConfig]
};