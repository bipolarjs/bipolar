import * as path from "path";

import { exec } from "shelljs";

import { expect } from "../../../Tests/BrowserTestsCore/Expect";

@suite
@timeout(20000)
export class RunSuiteTest {
    @test
    public async runCli(): Promise<void> {
        const output = exec(
            `node ${path.resolve(
                __dirname,
                "../../dist/cli.js"
            )} TestFiles\\ProjectWithSingleTestFile\\*.test.ts --require TestFiles\\Setup\\SetupBabelRegister.js`,
            {
                silent: true,
                encoding: "utf8",
                cwd: __dirname,
            }
        );
        expect(output.stdout).to.includes("Demo01Test")
        expect(output.stdout).to.includes("test01")
    }
}
