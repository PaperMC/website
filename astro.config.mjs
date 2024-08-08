import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import icon from "astro-icon";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [UnoCSS({ injectReset: true }), react(), icon({ iconDir: "src/assets" })],
  image: {
    remotePatterns: [{
      protocol: "https",
      hostname: "**.githubusercontent.com",
    }]
  }
});
