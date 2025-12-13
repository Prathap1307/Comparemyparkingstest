const plugin = () => ({
  postcssPlugin: 'autoprefixer-fallback',
});
plugin.postcss = true;

module.exports = plugin;
