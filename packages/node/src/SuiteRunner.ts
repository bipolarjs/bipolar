import {
    ISuiteExecutionReporter,
    RunContext,
    SuiteExecutionResult,
    SuiteHandle,
    SuiteStatus,
    TestHandle,
    TestStatus
} from "./IExecutionReporter";
import { nullSuiteExecutionReporter } from "./NullSuiteExecutionReporter";
import { SuiteMetadataContainer, suite, suiteMetadataAttr, test } from "@bipolar/meta";

export class SuiteRunner {
    private readonly suiteClass: new () => void & SuiteMetadataContainer;
    private readonly suiteFilePath: string;
    private readonly reporter: ISuiteExecutionReporter;

    constructor(suiteClass: new () => void, suiteFilePath: string, reporter: ISuiteExecutionReporter = nullSuiteExecutionReporter) {
        this.suiteFilePath = suiteFilePath;
        this.reporter = reporter;
        this.suiteClass = suiteClass as new () => void & SuiteMetadataContainer;
    }

    public async run(runContext: RunContext): Promise<void> {
        const suiteHandle: SuiteHandle = {
            context: runContext,
            name: this.suiteClass.name,
            tests: [],
            filePath: this.suiteFilePath,
        };
        const suiteResult: SuiteExecutionResult = {
            status: SuiteStatus.Passed,
        };

        const testHandles = [];
        for (const testInfo of this.suiteClass[suiteMetadataAttr].tests) {
            const testHandle: TestHandle = {
                context: runContext,
                suite: suiteHandle,
                name: testInfo.name,
            };
            testHandles.push(testHandle);
        }
        suiteHandle.tests = testHandles;

        await this.reporter.onStartSuite(suiteHandle);
        for (const testHandle of suiteHandle.tests) {
            try {
                await this.reporter.onStartTest(testHandle);
                await new Promise(r => setTimeout(r, 2000))
                const suiteInstance = new this.suiteClass();
                suiteInstance[testHandle.name]();
                await this.reporter.onFinishTest(testHandle, {status: TestStatus.Passed});
            } catch (e) {
                suiteResult.status = SuiteStatus.Failed;
                await this.reporter.onFinishTest(testHandle, {status: TestStatus.Failed});
            }
        }
        this.reporter.onFinishSuite(suiteHandle, suiteResult);
    }
}
