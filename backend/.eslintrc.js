module.exports = {
  env: {
    node: true,
    browser: true,
    commonjs: true,
    es2021: true,
    es6: true
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-essential"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
  },
  plugins: ["vue"],
  rules: {
    "no-unused-vars":"off"
  },
};