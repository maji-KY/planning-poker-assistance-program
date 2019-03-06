const webpackConfig = require("./webpack.config.js");
webpackConfig.output.filename = "[name].js";
module.exports = function(config) {
  config.set({
    "mime": {
      "text/x-typescript": ["ts", "tsx"]
    },
    "basePath": "",
    "frameworks": ["jasmine"],
    // patterns to load in the browser
    "files": [
      // "dist/build.js",
      "src/test/**/*.spec.ts"
    ],
    "exclude": [
    ],
    "preprocessors": {
      "src/test/**/*.spec.ts": ["webpack"]
    },
    "webpack": webpackConfig,
    "reporters": ["mocha"],
    "port": 9876,
    "colors": true,
    "logLevel": config.LOG_INFO,
    "autoWatch": true,
    "customLaunchers": {
      "ChromeHeadlessNoSandbox": {
        "base": "ChromeHeadless",
        "flags": ["--no-sandbox"]
      }
    },
    "browsers": ["ChromeHeadlessNoSandbox"],
    "singleRun": true,
    "concurrency": Infinity
  });
};
