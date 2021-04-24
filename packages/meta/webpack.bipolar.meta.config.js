const path = require("path");

module.exports = [{
    mode: "development",
    target: "node",
    entry: {
        index: "./src/index",
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "babel-loader",
                options: {
                    rootMode: "upward",
                },
                include: [path.join(__dirname, "src")],
            },
        ],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        library: {
            type: "commonjs2"
        }
    },
    resolve: {
        extensions: [".ts", ".js"],
    }
}];
