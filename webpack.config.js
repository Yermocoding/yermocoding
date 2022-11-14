const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: process.env.NODE_ENV === "development" && "source-map",
  target: process.env.NODE_ENV === "development" ? "web" : "browserslist",
  entry: { main: path.join(__dirname, "./src") },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "./build"),
    clean: true,
  },
  optimization: { splitChunks: { chunks: "all" } },
  devServer: {
    open: true,
    hot: false,
    port: 8081,
    static: { directory: path.join(__dirname, "./src") },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `${path.join(__dirname, "./src")}/pugs/index.pug`,
      minify: false,
      inject: false,
    }),
    new MiniCssExtractPlugin({ filename: "[name].css" }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${path.join(__dirname, "./src")}/assets/images`,
          to: `assets/images`,
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        use: { loader: "html-loader", options: { minimize: false } },
      },
      {
        test: /\.pug$/i,
        loader: "pug-loader",
        exclude: /node_modules/,
        options: { pretty: true },
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  ["postcss-preset-env"],
                  ["postcss-sorting", { "properties-order": "alphabetical" }],
                ],
              },
            },
          },
          {
            loader: "sass-loader",
            options: { sassOptions: { outputStyle: "expanded" } },
          },
        ],
      },
      {
        test: /\.m?js$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: { presets: ["@babel/preset-env"] },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: { filename: `assets/images/[name][ext][query]` },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: { filename: `assets/fonts/[name][ext][query]` },
      },
    ],
  },
};
