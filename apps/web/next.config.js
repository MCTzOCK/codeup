const withTM = require("next-transpile-modules")([
  "@codeup/components",
  "@codeup/util",
  "@codeup/hooks",
  "@codeup/rest",
]);

module.exports = withTM({
  reactStrictMode: true,
});
