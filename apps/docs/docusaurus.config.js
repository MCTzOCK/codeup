// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "InCode",
  tagline: "Einfach programmieren",
  url: "https://docs.incodelang.de",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/incode-400.png",
  organizationName: "incodedevs", // Usually your GitHub org/user name.
  projectName: "incode", // Usually your repo name.

  plugins: [require.resolve("@cmfcmf/docusaurus-search-local")],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl:
            "https://github.com/incodedevs/incode/tree/v4.x/packages/docs",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "InCode",
        logo: {
          alt: "InCode Logo",
          src: "img/incode-400.png",
        },
        items: [
          {
            type: "doc",
            docId: "intro",
            position: "left",
            label: "Dokumentation",
          },
          {
            href: "https://github.com/incodedevs/incode",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Dokumentation",
                to: "/docs/intro",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Discord",
                href: "https://discord.gg/9T5JEyXsrA",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/incodedevs",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/incodedevs/incode",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} The InCode Developers. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
