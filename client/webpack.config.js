import path from "path";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

const config = {
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: [".ts", ".js"],
    fallback: {
      buffer: require.resolve("buffer"),
    },
  },
  module: {
    rules: [{ test: /\.ts?$/, loader: "ts-loader" }],
  },
  devtool: "none",
  target: "node",
  context: path.resolve(__dirname, "src"),
  entry: "index.ts",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "build"),
    publicPath: "build",
  },
  node: {
    fs: "empty",
  },
};

export default config;
