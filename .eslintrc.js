module.exports =
{
    "env":
    {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "globals":
    {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions":
    {
        "ecmaVersion": 2018
    },
    "rules":
    {
        "brace-style":
            [
                "error",
                "allman"
            ],
        "curly":
            [
                "error",
                "multi-line"
            ],
        "object-curly-newline":
            [
                "error",
                "always",
                {
                    "ObjectExpression": "always",
                    "ObjectPattern":
                    {
                        "multiline": true
                    },
                    "ImportDeclaration": {
                        "multiline": true, "minProperties": 4
                    },
                    "ExportDeclaration": "never"
                }
            ]
    }
};