import childProcess from "child_process";
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

let currentCommit;
try {
  currentCommit = childProcess.execSync("git rev-parse HEAD").toString().slice(0, 7).trim();
} catch (error) {
  console.error("Failed to get the current commit:", error);
  currentCommit = "unknown";
}

const withMDX = createMDX({
  options: {
    rehypePlugins: [
      [
        require.resolve("rehype-pretty-code"),
        {
          theme: {
            light: "github-light-default",
            dark: "github-dark-default",
          },
          keepBackground: false,
          defaultLang: "bash",
          tokensMap: {
            fn: "entity.name.function",
            var: "variable",
          },
        },
      ],
    ],
  },
});

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
        loaders: [{ loader: "@svgr/webpack", options: { dimensions: false } }],
        as: "*.js",
      },
    },
    resolveExtensions: [".tsx", ".ts", ".jsx", ".js", ".json", ".mdx", ".md"],
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

export default withMDX(nextConfig);

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();