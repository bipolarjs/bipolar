module.exports = {
    presets: [["@babel/env", { targets: { node: "12" } }], "@babel/typescript"],
    plugins: [
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        ["@babel/plugin-proposal-class-properties", { loose: true }],
        ["@babel/plugin-proposal-optional-chaining"],
        ["@babel/plugin-proposal-nullish-coalescing-operator"],
    ]
};
