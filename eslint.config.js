import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["netlify/functions/**/*.js"],
    languageOptions: {
      globals: {
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        process: "readonly"
      }
    }
  }
];