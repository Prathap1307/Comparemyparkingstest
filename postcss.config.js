const tailwindcss = require('tailwindcss');

// Prefer the real autoprefixer package, but gracefully fall back to a tiny
// no-op plugin when the dependency cannot be installed in constrained
// environments. This keeps local builds from failing while still supporting
// full prefixing in production installs where `autoprefixer` is available.
let autoprefixer;
try {
  autoprefixer = require('autoprefixer');
} catch (error) {
  autoprefixer = require('./postcss.autoprefixer-fallback');
}

module.exports = {
  plugins: [tailwindcss, autoprefixer],
};
