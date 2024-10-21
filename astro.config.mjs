import icon from "astro-icon";
import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";

import cloudflare from "@astrojs/cloudflare";
import { execSync } from "node:child_process";

process.env.GIT_COMMIT_HASH = (process.env.GITHUB_SHA || "").trim().substring(0, 7) || fetchGitCommitHash();

function fetchGitCommitHash() {
  return execSync("git rev-parse --short HEAD").toString().trim();
}

// https://astro.build/config
export default defineConfig({
  integrations: [
    icon({
      iconDir: "src/assets",
    }),
    UnoCSS({
      injectReset: true,
    }),
  ],
  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.opencollective.com",
      },
    ],
  },
  output: "hybrid",
  adapter: cloudflare(),
});
