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
    private readonly reporter: ISuiteExecutionReporter;

    constructor(suiteClass: new () => void, reporter: ISuiteExecutionReporter = nullSuiteExecutionReporter) {
        this.reporter = reporter;
        this.suiteClass = suiteClass as new () => void & SuiteMetadataContainer;
    }

    public async run(runContext: RunContext): Promise<void> {
        const suiteHandle: SuiteHandle = {
            context: runContext,
            name: this.suiteClass.name,
        };
        const suiteResult: SuiteExecutionResult = {
            status: SuiteStatus.Passed,
        };

        this.reporter.onStartSuite(suiteHandle);
        for (const testInfo of this.suiteClass[suiteMetadataAttr].tests) {
            const testHandle: TestHandle = {
                context: runContext,
                suite: suiteHandle,
                name: testInfo.name,
            };
            try {
                this.reporter.onStartTest(testHandle);
                const suiteInstance = new this.suiteClass();
                suiteInstance[testInfo.name]();
                this.reporter.onFinishTest(testHandle, {status: TestStatus.Passed});
            } catch (e) {
                suiteResult.status = SuiteStatus.Failed;
                this.reporter.onFinishTest(testHandle, {status: TestStatus.Failed});
            }
        }
        this.reporter.onFinishSuite(suiteHandle, suiteResult);
    }
}
