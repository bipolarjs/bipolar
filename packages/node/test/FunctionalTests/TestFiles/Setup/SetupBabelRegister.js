const path = require("path");

require("@babel/register")({
    ignore: ["node_modules"],
    envName: "test",
    configFile: path.join(__dirname, "..", "..", "..", "..", "..", "babel.config.js"),
    cache: false,
    extensions: [".jsx", ".js", ".ts", ".tsx"],
});

require("@babel/polyfill");
