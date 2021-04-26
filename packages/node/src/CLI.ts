import { promisify } from "util";
import * as path from "path";

import glob from "glob";

import { parseCLIArguments } from "./CLIArgumentsParser";
import { SuiteMetadataContainer, suite, suiteMetadataAttr, test } from "@bipolar/meta";
import { SpecReporter } from "./SpecReporter";
import { SuiteRunner } from "./SuiteRunner";
import { WebStormReporter } from "./WebStormReporter";

const globAsync = promisify(glob);

export function isTestSuite(classConstructor: unknown): classConstructor is (new () => void) & SuiteMetadataContainer {
    const suiteContainer: SuiteMetadataContainer = classConstructor as SuiteMetadataContainer;
    return suiteContainer[suiteMetadataAttr] != undefined;
}

async function entryPoint(argv: string[]): Promise<void> {
    const options = parseCLIArguments(argv);
    const filesToExecute = [];
    for (const testFileGlob of options.testFileGlobs) {
        const files = await globAsync(testFileGlob, { cwd: process.cwd() });
        filesToExecute.push(...files.map(x => {
            return  path.isAbsolute(x) ? x : path.join(process.cwd(), x)
        }));
    }

    for (const requireModulePath of options.require) {
        let fullPath = path.isAbsolute(requireModulePath) ? requireModulePath : path.join(process.cwd(), requireModulePath);
        eval(`require(${JSON.stringify(fullPath)})`);
    }
    // const reporter = new SpecReporter();
    const reporter = new WebStormReporter();

    for (const file of filesToExecute) {
        const testModule = eval(`require(${JSON.stringify(file)})`);
        for (const testClass of Object.values(testModule)) {
            if (isTestSuite(testClass)) {
                const runner = new SuiteRunner(testClass, file, reporter);
                await runner.run({});
            }
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
entryPoint([...process.argv].slice(2));

