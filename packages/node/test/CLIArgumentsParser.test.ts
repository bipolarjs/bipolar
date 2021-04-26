import { parseCLIArguments } from "../src/CLIArgumentsParser";
import { expect, describe, test } from "@jest/globals";

describe('RunSuite', () => {
    test("parseArgumentWithGlobsOnly", () => {
        const result = parseCLIArguments(["zzzz.ts"]);
        expect(result.testFileGlobs).toEqual(["zzzz.ts"]);
    });

    test("parseRequireAsArray", () => {
        // expect(parseCLIArguments(["zzzz.ts"]).require).toEqual([]);
        expect(parseCLIArguments(["zzzz.ts", "--require", "x.js"]).require).toEqual(["x.js"]);
        expect(parseCLIArguments(["zzzz.ts", "--require", "x.js", "--require", "y.js"]).require).toEqual([
            "x.js",
            "y.js",
        ]);
    });
});
