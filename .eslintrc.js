module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  parserOptions: {
    project: ['./tsconfig.json']
  },
  plugins: ['svelte3', '@typescript-eslint'],
  root: true,
  overrides: [
    {
      files: ["*.svelte"],
      processor: "svelte3/svelte3"
    }
  ],
  settings: {
    'svelte3/typescript': require('typescript'),
    'svelte3/ignore-styles': () => true
  },
  rules: {
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/strict-boolean-expressions": [
      2,
      {
        "allowString": false,
        "allowNumber": false,
      }
    ]
  }
}
