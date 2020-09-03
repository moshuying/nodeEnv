var path = require('path');
var HtmlWebpackPlugin  = require("html-webpack-plugin");
module.exports = {
  //项目入口
  entry: "./src/index.js",
  //输出设置
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[hash:8].js",
  },
  resolve:{
    alias: {
      '@':path.resolve(__dirname,'src/')
    }
  },
  //调试工具
  devtool: "source-map", // 关了这玩意免得打包出来还带个map
  //调试服务
  devServer: {
    contentBase: path.join(__dirname, "public"),
    compress: true,
    port: 3916
  },
  //插件HtmlWebpackPlugin 
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' })
  ]
}