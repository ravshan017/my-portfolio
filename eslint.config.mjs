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
    // Статичные демо-проекты в public — сторонний код, не линтим
    "public/**",
    // Служебная папка среды выполнения агента — не наш код
    "deepseek-harness/**",
  ]),
]);

export default eslintConfig;
