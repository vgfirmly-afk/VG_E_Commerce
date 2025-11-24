// eslint.config.cjs
/**
 * FINAL WORKING ESLINT CONFIG
 * - No Svelte plugin required
 * - No crashes
 * - Cloudflare Workers supported
 * - Node scripts supported
 * - Test globals supported
 * - Ignores .svelte files completely (safe)
 */

module.exports = [
  // -------------------------------------------------
  // GLOBAL IGNORE PATTERNS
  // -------------------------------------------------
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "coverage/**",
      ".nyc_output/**",
      ".Temp/**",
      "**/utils/**",

      "frontend/.svelte-kit/**",
      "frontend/build/**",
      "frontend/.svelte-kit/**",
      "frontend/build/**",
      "**/*.svelte",
      "backend/*/.wrangler/**",
    ],
  },

  // -------------------------------------------------
  // DEFAULT JS RULES
  // -------------------------------------------------
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        // Cloudflare Worker / Web APIs
        console: "readonly",
        fetch: "readonly",
        Request: "readonly",
        Response: "readonly",
        Headers: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",

        // Encoding
        TextEncoder: "readonly",
        TextDecoder: "readonly",

        // Cryptography (Workers environment)
        crypto: "readonly",

        // Base64
        atob: "readonly",
        btoa: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "off",
      "no-console": "off",
      // keep no-undef as error to catch real errors:
      "no-undef": "error",
    },
  },

  // -------------------------------------------------
  // NODE SCRIPT FILES (tools, husky, build scripts)
  // -------------------------------------------------
  {
    files: [
      "scripts/**/*.js",
      ".husky/**/*",
      "tools/**/*.js",
      "build/**/*.js",
      "frontend/tailwind.config.js",
      "frontend/**/tailwind.config.js",
      "tailwind.config.js",
    ],
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        require: "readonly",
        module: "readonly",
        exports: "readonly",
      },
    },
    rules: {
      "no-console": "off",
    },
  },

  // -------------------------------------------------
  // TEST FILES (MOCHA + VITEST)
  // -------------------------------------------------
  {
    files: [
      "test/**/*.js",
      "backend/**/test/**/*.js",
      "**/*.spec.js",
      "**/*.test.js",
    ],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        before: "readonly",
        beforeEach: "readonly",
        after: "readonly",
        afterEach: "readonly",
        context: "readonly",
        expect: "readonly",
        vi: "readonly",
      },
    },
    rules: {
      "no-unused-expressions": "off",
      "no-undef": "off",
    },
  },

  // -------------------------------------------------
  // BACKEND WORKERS (Cloudflare Worker environment)
  // -------------------------------------------------
  {
    files: [
      "backend/**/src/**/*.{js,mjs,cjs}",
      "backend/**/index.{js,mjs,cjs}",
    ],
    languageOptions: {
      globals: {
        console: "readonly",

        // Fetch API (Cloudflare Worker)
        fetch: "readonly",
        Request: "readonly",
        Response: "readonly",
        Headers: "readonly",

        // URL APIs
        URL: "readonly",
        URLSearchParams: "readonly",

        // Crypto / encoding globals available in Worker runtime
        crypto: "readonly",
        atob: "readonly",
        btoa: "readonly",
        TextEncoder: "readonly",
        TextDecoder: "readonly",
      },
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^(?:_|env|ctx)$" }],
    },
  },

  // -------------------------------------------------
  // FRONTEND JS (Browser globals)
  // -------------------------------------------------
  {
    files: ["frontend/**/src/**/*.js"],
    languageOptions: {
      globals: {
        console: "readonly",
        fetch: "readonly",
        window: "readonly",
        document: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        crypto: "readonly",
      },
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^(?:_|env|ctx)$" }],
    },
  },

  // -------------------------------------------------
  // IGNORE SVELTE FILES (no plugin needed)
  // -------------------------------------------------
  {
    files: ["**/*.svelte"],
    rules: {
      "no-unused-vars": "off",
      "no-undef": "off",
    },
  },
];

// // eslint.config.cjs
// module.exports = [
//   // ignore node_modules, build outputs etc.
//   {
//     ignores: ["node_modules/**", "dist/**", "coverage/**"],
//   },

//   // rules for JS files
//   {
//     files: ["**/*.js"],
//     languageOptions: {
//       ecmaVersion: "latest",
//       sourceType: "module",
//     },
//     rules: {
//       // enable some sensible defaults; tweak to taste
//       "no-unused-vars": "warn",
//       "no-undef": "error",
//       "no-console": "off",
//     },
//   },

//   // optionally add Typescript / other overrides here
// ];

// // eslint.config.js (ES module style)
// import recommended from "eslint/conf/eslint-recommended.js";

// export default [
//   recommended,
//   { files: ["**/*.js"], rules: { /* overrides */ } }
// ];
