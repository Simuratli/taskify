import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:@typescript-eslint/recommended", // Add TypeScript recommendations
    "plugin:unused-imports/recommended" // Ensure the unused-imports plugin is included
  ),
  {
    rules: {
      // Ignore unused variables but keep the "no-unused-vars" rule for arguments
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

      // Enforce specific types and disallow 'any'
      "@typescript-eslint/no-explicit-any": "error",

      // Prefer 'const' over 'let' when variables are not reassigned
      "prefer-const": "error",

      // Automatically remove unused imports
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" },
      ],
    },
  },
];

export default eslintConfig;
