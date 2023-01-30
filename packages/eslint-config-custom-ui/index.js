module.exports = {
  "parser": "@typescript-eslint/parser",
  "plugins": ["prettier", "@typescript-eslint", "jsx-a11y", "import", "unicorn"],
  "extends": [
    "eslint:recommended",
    "esnext",
    "esnext/style-guide",
    "airbnb-base",
    "plugin:@typescript-eslint/recommended",
    "airbnb",
    "prettier",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "plugin:import/typescript",
    "plugin:react-hooks/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 2021,
    "sourceType": "module",
    "project": ["tsconfig.json"],
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "linebreak-style": [2, "unix"],
    "semi": [2, "always"],
    "strict": [2, "function"],
    "no-multiple-empty-lines": [2, { "max": 1 }],
    "max-len": [
      "error",
      {
        "code": 140,
        "ignoreComments": true,
        "ignoreStrings": true,
        "ignoreTemplateLiterals": true
      }
    ],
    "no-underscore-dangle": ["error", { "allow": ["_id"] }],
    "import/prefer-default-export": "off",
    "import/no-cycle": "off",
    "import/no-extraneous-dependencies": "off",
    "import/no-unresolved": 2,
    "import/no-commonjs": 2,
    "import/extensions": [2, "never", {
      "js": "ignorePackages",
      "ts": "ignorePackages",
      "tsx": "ignorePackages",
      "jsx": "ignorePackages",
      "json": "never",
    }],
    "prettier/prettier": [
      "error",
      {
        "singleQuote": true,
        "printWidth": 140,
        "tabWidth": 2,
        "bracketSpacing": true,
        "indent": 2,
        "trailingComma": "none"
      }
    ],
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"],
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/require-await": 2,
    "sort-imports": "off",
    "import/no-nodejs-modules": 2,
    "react/function-component-definition": [2, {
      "namedComponents": ["function-expression", "arrow-function"],
      "unnamedComponents": ["function-expression", "arrow-function"]
    }],
    "react/jsx-filename-extension": [2, { "extensions": [".jsx", ".tsx"] }],
    "react/require-default-props": 0
  },
  "env": {
    "es6": true,
    "es2021": true,
    "browser": true,
    "serviceworker": true
  },
  "settings": {
    "import/resolver": {
      "typescript": {
        "project": "apps/*/tsconfig.json",
        "paths": [ "./src"],
        "extensions": [ ".ts", ".tsx", ".d.ts" ]
      }
    }
  }
};
