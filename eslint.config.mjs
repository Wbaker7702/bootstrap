import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";
import unicorn from "eslint-plugin-unicorn";
import markdown from "@eslint/markdown";
import html from "eslint-plugin-html";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

const xo = require("eslint-config-xo");
const xoBrowser = require("eslint-config-xo/browser");

const cleanOptions = (options) => {
  if (!options) return options;
  const { allowTrailingCommas, ...rest } = options;
  return rest;
};

const cleanConfigDeep = (cfg) => {
  if (!cfg || typeof cfg !== 'object') return cfg;

  if (Array.isArray(cfg)) {
    return cfg.map(cleanConfigDeep);
  }

  const newCfg = { ...cfg };

  if (newCfg.parserOptions) {
    newCfg.parserOptions = cleanOptions(newCfg.parserOptions);
  }
  if (newCfg.languageOptions) {
    newCfg.languageOptions = cleanOptions(newCfg.languageOptions);
  }
  if (newCfg.overrides) {
    newCfg.overrides = newCfg.overrides.map(cleanConfigDeep);
  }
  return newCfg;
};

const addConfig = (mod) => {
  let cfg = mod.default || mod;
  cfg = cleanConfigDeep(cfg);

  if (Array.isArray(cfg)) {
    return cfg;
  }

  const { __esModule, ...rest } = cfg;
  return compat.config(rest);
};

const jsFiles = ["**/*.js", "**/*.mjs", "**/*.cjs", "**/*.html"];

const applyFiles = (configOrArray, files) => {
  const flatConfigs = [configOrArray].flat(Infinity);
  return flatConfigs.map(c => {
    if (!c || typeof c !== 'object') return c;
    if (c.files) return c;
    return { ...c, files };
  });
};

export default [
    {
        ignores: [
            "**/*.min.js",
            "**/dist/",
            "**/vendor/",
            "/_site/",
            "/site/public/",
            "/js/coverage/",
            "/site/static/sw.js",
            "/site/static/docs/**/assets/sw.js",
            "/site/layouts/partials/",
            "**/*.json",
            "**/*.yml",
            "**/*.yaml",
            "**/*.css",
            "**/*.scss",
            "**/*.map",
            "**/*.ts",
            "**/*.tsx",
            "**/*.d.ts"
        ]
    },
  // Unicorn
  ...applyFiles(unicorn.configs["recommended"], jsFiles),
  // Imports
  ...applyFiles(compat.extends("plugin:import/errors", "plugin:import/warnings"), jsFiles),
  // XO
  ...applyFiles(addConfig(xo), jsFiles),
  ...applyFiles(addConfig(xoBrowser), jsFiles),
    {
        files: jsFiles,
        rules: {
            "arrow-body-style": "off",
            "capitalized-comments": "off",
            "comma-dangle": "off",
            "import/extensions": ["error", "ignorePackages", {
                js: "always"
            }],
            "import/first": "error",
            "import/newline-after-import": "error",
            "import/no-absolute-path": "error",
            "import/no-amd": "error",
            "import/no-cycle": ["error", {
                ignoreExternal: true
            }],
            "import/no-duplicates": "error",
            "import/no-extraneous-dependencies": "error",
            "import/no-mutable-exports": "error",
            "import/no-named-as-default": "error",
            "import/no-named-as-default-member": "error",
            "import/no-named-default": "error",
            "import/no-self-import": "error",
            "import/no-unassigned-import": ["error"],
            "import/no-useless-path-segments": "error",
            "import/order": "error",
            indent: "off",
            "@stylistic/indent": "off",
            "@stylistic/semi": "off",
            "@stylistic/comma-dangle": "off",
            "@stylistic/object-curly-spacing": "off",
            "@stylistic/function-paren-newline": "off",
            "@stylistic/curly-newline": "off",
            "@stylistic/operator-linebreak": "off",
            "@stylistic/quotes": "off",
            "@stylistic/arrow-parens": "off",
            "@stylistic/padding-line-between-statements": "off",
            "@stylistic/max-len": "off",
            "@stylistic/quote-props": "off",
            "@stylistic/indent-binary-ops": "off",
            "dot-notation": "off",
            "curly": "off",
            "strict": "off",
            "prefer-arrow-callback": "off",
            "no-var": "off",
            "no-restricted-globals": "off",
            "max-nested-callbacks": "off",
            "logical-assignment-operators": "off",
            "max-params": ["warn", 5],
            "multiline-ternary": "off",
            "new-cap": ["error", {
                properties: false
            }],
            "no-console": "error",
            "no-negated-condition": "off",
            "object-curly-spacing": "off",
            "operator-linebreak": "off",
            "prefer-object-has-own": "off",
            "prefer-template": "error",
            "semi": "off",
            "unicorn/explicit-length-check": "off",
            "unicorn/filename-case": "off",
            "unicorn/no-anonymous-default-export": "off",
            "unicorn/no-array-callback-reference": "off",
            "unicorn/no-array-method-this-argument": "off",
            "unicorn/no-null": "off",
            "unicorn/no-typeof-undefined": "off",
            "unicorn/no-unused-properties": "error",
            "unicorn/numeric-separators-style": "off",
            "unicorn/prefer-array-flat": "off",
            "unicorn/prefer-at": "off",
            "unicorn/prefer-dom-node-dataset": "off",
            "unicorn/prefer-global-this": "off",
            "unicorn/prefer-module": "off",
            "unicorn/prefer-query-selector": "off",
            "unicorn/prefer-spread": "off",
            "unicorn/prefer-string-raw": "off",
            "unicorn/prefer-string-replace-all": "off",
            "unicorn/prefer-structured-clone": "off",
            "unicorn/prevent-abbreviations": "off",
            "max-lines": "off",
            "unicorn/expiring-todo-comments": "off"
        }
    },
    {
        files: [".babelrc.js", "package.js", "site/postcss.config.cjs"],
        languageOptions: {
            globals: {
                ...globals.node,
                module: "writable",
                require: "readonly",
                Package: "readonly" // Meteor package definition
            }
        }
    },
    {
        files: ["**/*.html"],
        plugins: {
            html
        },
        settings: {
            "html/html-extensions": [".html"]
        }
    },
    {
        files: ["js/tests/unit/jquery.spec.js"],
        languageOptions: {
            globals: {
                ...globals.jquery,
                $: "readonly",
                jQuery: "readonly"
            }
        }
    },
    {
        files: ["js/tests/unit/chip.spec.js"],
        languageOptions: {
            globals: {
                ...globals.jest,
                jest: "readonly"
            }
        }
    },
    {
        files: ["js/tests/karma.conf.js"],
        rules: {
            "no-implicit-globals": "off"
        }
    },
    {
        files: ["js/tests/visual/tooltip.html"],
        rules: {
            "unicorn/no-unused-properties": "off"
        }
    },
    {
        files: ["build/**", "chip-demo.html"],
        languageOptions: {
            globals: {
                ...globals.node
            },
            sourceType: "module"
        },
        rules: {
            "no-console": "off",
            "unicorn/prefer-top-level-await": "off"
        }
    },
  {
    files: ["js/tests/*.js", "js/tests/integration/rollup*.js"],
    languageOptions: {
      globals: {
        ...globals.node
      },
      sourceType: "script"
    }
  },
  {
    files: ["js/tests/unit/**"],
    languageOptions: {
      globals: {
        ...globals.jasmine
      }
    },
    rules: {
      "no-console": "off",
      "unicorn/consistent-function-scoping": "off",
      "unicorn/no-useless-undefined": "off",
      "unicorn/prefer-add-event-listener": "off"
    }
  },
  {
    files: ["js/tests/visual/**"],
    plugins: {
      html
    },
    settings: {
      "html/html-extensions": [".html"]
    },
    rules: {
      "no-console": "off",
      "no-new": "off",
      "unicorn/no-array-for-each": "off"
    }
  },
  {
    files: ["scss/tests/**"],
    languageOptions: {
      globals: {
        ...globals.node
      },
      sourceType: "script"
    }
  },
  {
    files: ["site/**"],
    languageOptions: {
      globals: {
        ...globals.browser
      },
      sourceType: "script",
      ecmaVersion: 2019
    },
    rules: {
      "no-new": "off",
      "unicorn/no-array-for-each": "off"
    }
  },
  {
    files: [
      "site/src/assets/application.js",
      "site/src/assets/partials/*.js",
      "site/src/assets/search.js",
      "site/src/assets/snippets.js",
      "site/src/assets/stackblitz.js",
      "site/src/plugins/*.js"
    ],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: 2020
    }
  },
    {
        files: ["**/*.md"],
        rules: {
            "markdown/heading-increment": "off"
        }
    },
    {
        files: ["SECURITY.md"],
        rules: {
            "markdown/heading-increment": "off"
        }
    },
    ...markdown.configs.recommended,
  {
    files: ["**/*.md/*.js", "**/*.md/*.mjs"],
    languageOptions: {
      sourceType: "module"
    },
    rules: {
      "unicorn/prefer-node-protocol": "off"
    }
  }
];
