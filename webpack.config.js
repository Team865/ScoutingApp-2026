const path = require("path");

module.exports = {
    entry: {
        "superscouting/main": "./src/typescript/superscouting/main.ts",
        "analysis/main": "./src/typescript/analysis/main.ts"
    },
    module: {
        rules: [
            {
                use: "ts-loader"
            }
        ]
    },
    mode: "development",
    resolve: {
        extensions: [".ts"]
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "static/build")
    },
    infrastructureLogging: {
        level: "warn"
    }
}