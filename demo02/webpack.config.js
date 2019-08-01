//Multiple entry files (source)
//Multiple entry files are allowed. It is useful for a multi-page app which has different entry file for each page.

module.exports = {
  entry: {
    bundle2: './main1.js',
    bundle1: './main2.js'
  },
  output: {
    filename: '[name].js'
  }
};
