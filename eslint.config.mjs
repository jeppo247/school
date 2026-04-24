import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import globals from "globals";

const cwd = process.cwd().replace(/\\/g, "/");
const isWebWorkspace = cwd.endsWith("/apps/web");

export default [
  {
    ignores: [
      "**/.next/**",
      "**/dist/**",
      "**/node_modules/**",
      "**/next-env.d.ts",
      "**/*.config.js",
      "**/*.config.mjs",
      "**/*.config.ts",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "no-undef": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      }],
    },
  },
  ...(isWebWorkspace ? [
    {
      files: ["**/*.{ts,tsx}"],
      plugins: {
        ...nextPlugin.flatConfig.recommended.plugins,
        react: reactPlugin,
      },
      rules: {
        ...nextPlugin.flatConfig.recommended.rules,
        ...nextPlugin.flatConfig.coreWebVitals.rules,
        "@next/next/no-html-link-for-pages": "off",
      },
      settings: {
        next: {
          rootDir: ".",
        },
      },
    },
  ] : []),
];
