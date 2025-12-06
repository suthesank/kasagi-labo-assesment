import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["**/*.ts", "**/*.tsx"], // Apply this rule only to TypeScript files
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Disables the warning entirely
      // Alternatively, set to 'warn' to downgrade it to a warning (if not already a warning)
      // '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]);

export default eslintConfig;
