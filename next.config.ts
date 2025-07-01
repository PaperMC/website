import type { NextConfig } from "next";
import WindiCSSWebpackPlugin from "windicss-webpack-plugin";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
