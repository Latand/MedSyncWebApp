module.exports = {
    env: {browser: true, es2020: true},
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
    ],
    parserOptions: {ecmaVersion: 'latest', sourceType: 'module'},
    settings: {react: {version: '18.2'}},
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh', '@typescript-eslint'],
    rules: {
        'react-refresh/only-export-components': 'warn',
        "react/prop-types": 0,
        "indent": ["error", 2],
        "linebreak-style": 1,
        "quotes": ["error", "double"],
        "semi": ["error", "never"],
    },
}
