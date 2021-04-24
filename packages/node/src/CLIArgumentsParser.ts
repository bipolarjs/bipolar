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
                type: "array",
                description: "Require module before all test starts",
                default: [],
            },
        })
        .parse();
    return {
        testFileGlobs: yargsParseResult._.map(x => x.toString()),
        require: yargsParseResult.require,
    };
}
