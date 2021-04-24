import { parseCLIArguments } from "../src/CLIArgumentsParser";
import { expect } from "../../Engine/test/Engine/Expect";

@suite
export class CLIArgumentsParserTest {
    @test
    public parseArgumentWithGlobsOnly(): void {
        const result = parseCLIArguments(["zzzz.ts"]);
        expect(result.testFileGlobs).to.eql(["zzzz.ts"]);
    }

    @test
    public parseRequireAsArray(): void {
        expect(parseCLIArguments(["zzzz.ts"]).require).to.eql([]);
        expect(parseCLIArguments(["zzzz.ts", "--require", "x.js"]).require).to.eql(["x.js"]);
        expect(parseCLIArguments(["zzzz.ts", "--require", "x.js", "--require", "y.js"]).require).to.eql([
            "x.js",
            "x.js",
        ]);
    }
}
