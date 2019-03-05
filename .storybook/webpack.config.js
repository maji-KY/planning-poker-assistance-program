const path = require("path");

module.exports = (storybookBaseConfig, configType, defaultConfig) => {
  storybookBaseConfig.module.rules.push({
    "test": /\.tsx?$/,
    "exclude": /node_modules/,
    "loader": "ts-loader"
  });
  storybookBaseConfig.resolve.extensions.push(".ts", ".tsx", ".js");
  storybookBaseConfig.resolve.modules.push(path.join(__dirname, "../src/main"));

  return storybookBaseConfig;
};

