import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginSvelte from "eslint-plugin-svelte";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import svelteParser from "svelte-eslint-parser";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  // Ignore patterns
  {
    ignores: ["dist/**", "node_modules/**", ".astro/**", ".wrangler/**", "bun.lock", "*.config.js", "*.config.mjs", "*.config.ts"],
  },

  // Base TypeScript configuration
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",
    },
  },

  // Astro configuration
  ...eslintPluginAstro.configs.recommended,
  {
    files: ["**/*.astro"],
    rules: {
      // Astro-specific rules
      "astro/no-set-html-directive": "error",
      "astro/no-unused-css-selector": "warn",
    },
  },

  // Svelte configuration
  ...eslintPluginSvelte.configs["flat/recommended"],
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: typescriptParser,
        extraFileExtensions: [".svelte"],
      },
    },
    rules: {
      // Svelte-specific rules
      "svelte/no-at-html-tags": "warn",
      "svelte/no-unused-svelte-ignore": "warn",
      "svelte/valid-compile": "error",
    },
  },

  // Prettier compatibility (must be last)
  eslintConfigPrettier,
];
