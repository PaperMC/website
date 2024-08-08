import react from "@astrojs/react";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";

// https://astro.build/config
export default defineConfig({
  integrations: [
    icon({
      iconDir: "src/assets",
    }),
    UnoCSS({
      injectReset: true,
    }),
    react(),
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
});
