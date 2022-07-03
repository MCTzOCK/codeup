const withTM = require("next-transpile-modules")([
  "@codeup/components",
  "@codeup/util",
  "@codeup/hooks",
]);

module.exports = withTM({
  reactStrictMode: true,
});
