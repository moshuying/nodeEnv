var path = require('path');
var HtmlWebpackPlugin  = require("html-webpack-plugin");
module.exports = {
  //项目入口
  entry: "./src/index.js",
  //输出设置
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, 'dist'),
  },
  //调试工具
  // devtool: "source-map", // 关了这玩意免得打包出来还带个map
  //调试服务
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 8080
  },
  //插件HtmlWebpackPlugin 
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' })
  ]
}