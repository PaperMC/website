import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { execSync } from "child_process";
import svelte from "@astrojs/svelte";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";

const GIT_COMMIT_HASH = (process.env.GITHUB_SHA || "").trim().slice(0, 7) || execSync("git rev-parse --short HEAD").toString().trim();

export default defineConfig({
  site: "https://papermc.io",

  vite: {
    plugins: [tailwindcss()],
    define: {
      "import.meta.env.GIT_COMMIT_HASH": JSON.stringify(GIT_COMMIT_HASH),
    },
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
    mdx(),
  ],

  adapter: cloudflare({
    platformProxy: {
      enabled: true,
      persist: true,
    },
    workerEntryPoint: {
      path: "src/worker.ts",
    },
  }),
});
