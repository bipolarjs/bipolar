import yargs from "yargs";

export interface CLIOptions {
    require: string[];
    testFileGlobs: string[];
}

export function parseCLIArguments(argv: string[]): CLIOptions {
    const yargsParseResult = yargs(argv)
        .scriptName("bipolar")
        .usage("$0 <options> <test-globs>")
        .options({
            require: {
                alias: "r",
                type: "string",
                description: "Require module before all test starts",
            },
            webstorm: {
                type: "boolean",
                requiresArg: false,
                description: "Require module before all test starts",
            },
        })
        .parse();
    let requireValue = yargsParseResult.require;
    if (yargsParseResult.webstorm != undefined) {
        requireValue = "./Tests/SetupMocha.js";
        return {
            testFileGlobs: yargsParseResult._.map(x => x.toString()),
            require: Array.isArray(requireValue) ? requireValue : (typeof requireValue === "string" ? [requireValue] : []),
        };
    }
    return {
        testFileGlobs: yargsParseResult._.map(x => x.toString()),
        require: Array.isArray(requireValue) ? requireValue : (typeof requireValue === "string" ? [requireValue] : []),
    };
}
