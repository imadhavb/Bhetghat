require("@babel/register"); // this is required to write es6 style code here

import path from "path";
import webpack from "webpack";
import merge from "webpack-merge";
import HtmlWebpackPlugin from "html-webpack-plugin";

const resolveRoot = (...args) => path.join(__dirname, ...args);
const resolveSrc = () => resolveRoot("src");
const isDev = process.env.NODE_ENV || "development";

const config = {
  entry: resolveSrc(),
  output: {
    path: resolveRoot("public", "js"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: resolveSrc(),
        exclude: resolveRoot("node_modules"),
        use: "babel-loader",
      },
      {
        test: /\.s?css$/,
        include: resolveSrc(),
        exclude: resolveRoot("node_modules"),
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolveRoot("public", "index.html"),
      inject: "body",
    }),
  ],
  resolve: {
    modules: ["node_modules", resolveSrc()],
    extensions: [".js", ".jsx", ".json", ".css", "./scss"],
    alias: {
      "react-dom": "@hot-loader/react-dom", // this is for a hook support, replace with fast-refresh once webpack supports it
      src: resolveSrc(),
    },
  },
};

const dev = merge(config, {
  devtool: "cheap-module-inline-source-map",
  mode: "development",
  devServer: {
    proxy: {
      "/api": "http://localhost:3002",
    },
    contentBase: resolveRoot("public"),
    noInfo: true,
    host: "0.0.0.0",
    port: 3000,
    historyApiFallback: true,
    disableHostCheck: true,
    hot: true,
    compress: true,
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
});

const prod = merge(config, {
  devtool: "source-map",
  mode: "production",
});

console.log("Application is running on port 3000");
console.log(`Env: ${process.env.NODE_ENV}`);

export default isDev ? dev : prod;
