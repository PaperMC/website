const WindiCSSWebpackPlugin = require("windicss-webpack-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.plugins.push(new WindiCSSWebpackPlugin());
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: { dimensions: false },
        },
      ],
    });

    return config;
  },
  // Workaround for next/image and 'next export' to work with Cloudflare Pages
  // TODO: Remove when using our own infra
  images: {
    loader: "imgix",
    path: "https://face-lift.pages.dev/",
  },
};

module.exports = nextConfig;
