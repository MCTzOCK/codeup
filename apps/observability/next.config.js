const withTM = require("next-transpile-modules")([
  "@codeup/util",
  "@codeup/hooks",
  "@codeup/rest",
]);

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = withTM({
  /* config options here */
  poweredByHeader: false,
  compress: true,
});

module.exports = nextConfig;
