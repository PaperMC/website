import { defineConfig } from 'astro/config';
import windicss from 'astro-windicss';

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [windicss(), react()]
});