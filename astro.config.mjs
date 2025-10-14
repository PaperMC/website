// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import { execSync } from "child_process";

import svelte from "@astrojs/svelte";

import icon from "astro-icon";

import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

process.env.GIT_COMMIT_HASH =
  (process.env.GITHUB_SHA || "").trim().substring(0, 7) || fetchGitCommitHash();

function fetchGitCommitHash() {
  return execSync("git rev-parse --short HEAD").toString().trim();
}

export default defineConfig({
  site: "https://papermc.io",

  vite: {
    plugins: [tailwindcss()],
  },

  image: {
    responsiveStyles: true,
    layout: "full-width",
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

  integrations: [
    svelte(),
    icon({
      iconDir: "src/assets",
    }),
    sitemap(),
  ],

  adapter: cloudflare(),
});
