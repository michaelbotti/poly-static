exports.onCreateWebpackConfig = ({ actions, getConfig }) => {
  actions.setWebpackConfig({
    experiments: {
      syncWebAssembly: true,
    },
    output: {
      filename: `[name].js?v=2`,
      chunkFilename: `[name].js?v=2`,
      path: getConfig().output.path,
      publicPath: getConfig().output.publicPath,
    },
  });
};
