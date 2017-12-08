const path = require("path");
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env);

  config.module.rules.push({
    test: /\.tsx?$/,
    exclude: /node_modules/,
    loader: "ts-loader"
  });
  config.resolve.extensions.push('.ts', '.tsx', ".js");
  config.resolve.modules.push(path.join(__dirname, "../src/main"));

  return config;
};

