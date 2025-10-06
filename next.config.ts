import childProcess from "child_process";

import type { NextConfig } from "next";

let currentCommit;
try {
  currentCommit = childProcess.execSync("git rev-parse HEAD").toString().slice(0, 7).trim();
} catch (error) {
  console.error("Failed to get the current commit:", error);
  currentCommit = "unknown";
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    CURRENT_COMMIT: currentCommit,
  },
  webpack: (config) => {
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
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              dimensions: false,
            },
          },
        ],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();