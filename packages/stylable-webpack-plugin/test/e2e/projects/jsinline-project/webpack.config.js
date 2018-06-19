const StylableWebpackPlugin = require("../../../../src");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // mode: "development",
  mode: "production",
  context: __dirname,
  devtool: "source-map",
  plugins: [new HtmlWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.st\.css$/,
        loader: require.resolve('stylable-webpack-plugin/src/loader.js'),
        sideEffects: false
      }
    ]
  }
};
