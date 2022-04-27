const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");

const env = process.env.NODE_ENV;
const distDir = ".";

const config = {
  "mode": env,
  "entry": [path.resolve(__dirname, "src/main/main.ts")],
  "output": {
    "path": path.join(__dirname, distDir),
    "filename": "index.js",
    "libraryTarget": "this",
  },
  "target": "node",
  "externals": [nodeExternals()],

  "resolve": {
    "extensions": [".tsx", ".ts", ".js"],
    "modules": [path.join(__dirname, "src/main"), "node_modules"],
  },

  "plugins": [
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify(env),
      },
    }),
  ],

  "module": {
    "rules": [
      {
        "test": /\.tsx?$/,
        "use": ["ts-loader"],
        "exclude": /node_modules/,
      },
    ],
  },
};

module.exports = config;
