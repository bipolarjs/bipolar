const path = require("path");

module.exports = {
    mode: "development",
    target: "node",
    entry: {
        bipolar: "./src/CLI",
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "babel-loader",
                options: {
                    rootMode: "upward"
                },
                include: [path.join(__dirname, "src")],
            },
        ],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
    },
    resolve: {
        extensions: [".ts", ".js"],
        mainFields: ["main"],
    },
    devtool: false,
};
