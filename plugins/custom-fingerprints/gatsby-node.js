const md5 = require("md5");

exports.onCreateWebpackConfig = (
  { stage, getConfig, actions },
  pluginOptions
) => {
  if (stage === "build-javascript") {
    const hash = md5(`${new Date().getTime()}`);
    const newWebpackConfig = {
      ...getConfig(),
      output: {
        filename: `[name].js?v=${hash}`,
        chunkFilename: `[name].js?v=${hash}`,
        path: getConfig().output.path,
        publicPath: getConfig().output.publicPath,
      },
    };

    actions.replaceWebpackConfig(newWebpackConfig);
  }
};
