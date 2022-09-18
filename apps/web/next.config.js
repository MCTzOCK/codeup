const path = require("path");

const withTM = require("next-transpile-modules")([
  "@codeup/components",
  "@codeup/util",
  "@codeup/hooks",
  "@codeup/rest",
]);

const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    providerImportSource: "@mdx-js/react",
  },
});

module.exports = withTM(
  withMDX({
    reactStrictMode: true,
    pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
    sassOptions: {
      includePaths: [path.join(__dirname, "src", "styles")],
    },
  })
);
