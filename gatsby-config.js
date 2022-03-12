const tailwindConfig = require("./tailwind.config.js");

// const authHeaders =
//   process.env.APP_ENV === "development"
//     ? {}
//     : {
//         "/mint": [
//           `Basic-Auth: ${process.env.NODEJS_APP_USERNAME}:${process.env.NODEJS_APP_PASSWORD}`,
//         ],
//         "/mint/*": [
//           `Basic-Auth: ${process.env.NODEJS_APP_USERNAME}:${process.env.NODEJS_APP_PASSWORD}`,
//         ],
//         "/queue": [
//           `Basic-Auth: ${process.env.NODEJS_APP_USERNAME}:${process.env.NODEJS_APP_PASSWORD}`,
//         ],
//         "/queue/*": [
//           `Basic-Auth: ${process.env.NODEJS_APP_USERNAME}:${process.env.NODEJS_APP_PASSWORD}`,
//         ],
//       };

module.exports = {
  flags: {
    LMDB_STORE: true,
  },
  siteMetadata: {
    title: "ADA Handle",
    description: `Custom Cardano addresses for everyone.`,
    author: `@adahandle`,
  },
  plugins: [
    `gatsby-plugin-material-ui`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-layout`,
    {
      resolve: `gatsby-plugin-recaptcha`,
      options: {
        async: true,
        defer: false,
        args: `?render=6Ld0QUkcAAAAAN-_KvCv8R_qke8OYxotNJzIg2RP`,
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [process.env.GTAG],
        gtagConfig: {
          anonymize_ip: true,
          cookie_expires: 0,
        },
        pluginConfig: {
          head: false,
          respectDNT: true,
          exclude: [],
        },
      },
    },
    {
      resolve: `gatsby-plugin-typescript`,
      options: {
        isTSX: true,
        jsxPragma: `jsx`,
        allExtensions: true,
      },
    },
    {
      resolve: `gatsby-plugin-postcss`,
      options: {
        postCssPlugins: [
          require(`tailwindcss`)(tailwindConfig),
          require(`autoprefixer`),
          ...(process.env.APP_ENV === `production` ? [require(`cssnano`)] : []),
        ],
      },
    },
    {
      resolve: "gatsby-plugin-web-font-loader",
      options: {
        google: {
          families: ["Noto Sans:400,400italic,700,700italic"],
        },
      },
    },
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        mergeLinkHeaders: false,
        mergeCachingHeaders: false,
      },
    },
  ],
};
