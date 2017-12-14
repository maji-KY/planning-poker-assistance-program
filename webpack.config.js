const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const extractSASS = new ExtractTextPlugin("bundle.css");

const env = process.env.NODE_ENV;
const distDir = "public";

const config = {
  "entry": [
    path.resolve(__dirname, "src/main/main.tsx")
  ],
  "output": {
    "path": path.join(__dirname, distDir),
    "filename": "bundle.js"
  },

  "resolve": {
    "extensions": [".tsx", ".ts", ".js"],
    "modules": [
      path.join(__dirname, "src/main"),
      "node_modules"
    ]
  },

  "plugins": [
    new CleanWebpackPlugin([distDir]),
    new HtmlWebpackPlugin({
      "template": "index.html"
    }),
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify(env)
      }
    }),
    extractSASS
  ],

  "module": {
    "rules": [
      {
        "test": /\.tsx?$/,
        "use": ["ts-loader"],
        "exclude": /node_modules/
      },
      {
        "test": /\.(jpg|png|mp4|ico)$/,
        "use": "file-loader?name=[name].[ext]"
      },
      {
        "test": /\.scss$/,
        "use": extractSASS.extract(["css-loader?modules", "sass-loader"])
      }
    ]
  }
};

if (env === "production") {
  config.plugins.push(new UglifyJsPlugin({
    "uglifyOptions": {
      "ecma": 8
    }
  }));
  config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
  config.plugins.push(new webpack.optimize.AggressiveMergingPlugin());
  config.plugins.push(new webpack.LoaderOptionsPlugin({"minimize": true}));
} else {
  config.plugins.push(new webpack.NamedModulesPlugin());
  config.devtool = "eval";
  config.externals = {};
}

module.exports = config;
