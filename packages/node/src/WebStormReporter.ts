import {
    IExecutionReporter,
    RunContext,
    SuiteExecutionResult,
    SuiteHandle,
    TestExecutionResult,
    TestHandle
} from "./IExecutionReporter";

export class WebStormReporter implements IExecutionReporter {
    public readonly eventLog: string[] = [];

    public onStartRun(context: RunContext): void | Promise<void> {
        console.log("##teamcity[enteredTheMatrix]");
        console.log("##teamcity[testingStarted]");
    }

    public onFinishRun(context: RunContext): void | Promise<void> {
        console.log("##teamcity[testingFinished]");
    }

    public onStartSuite(suite: SuiteHandle): void | Promise<void> {
        console.log(
            `##teamcity[testSuiteStarted ` +
            `nodeId='${suite.name}' ` +
            `parentNodeId='0' ` +
            `name='${suite.name}' ` +
            `running='false' ` +
            `nodeType='suite' ` +
            `locationHint='file://${suite.filePath}' ` +
            `]`
        )
        console.log(
            `##teamcity[testSuiteStarted ` +
            `name='${suite.name}' ` +
            `running='true' ` +
            `]`
        )
        console.log(`##teamcity[testCount count='${suite.tests.length.toString()}']`);

        for (const test of suite.tests) {
            console.log(`##teamcity[testStarted ` +
                `nodeId='${test.suite.name}-${test.name}' ` +
                `parentNodeId='${test.suite.name}' ` +
                `name='${test.name}' ` +
                `running='false' ` +
                `nodeType='test' ` +
                `locationHint='test://${test.suite.filePath}${test.name}']`)
        }
    }

    public onFinishSuite(suite: SuiteHandle, suiteResult: SuiteExecutionResult): void | Promise<void> {
        console.log(`##teamcity[testSuiteFinished nodeId='${suite.name}']`);
    }

    public onStartTest(test: TestHandle): void | Promise<void> {
        console.log(`##teamcity[testStarted ` +
            `nodeId='${test.suite.name}-${test.name}' ` +
            `running='true'` +
            `]`)
    }

    public onFinishTest(test: TestHandle, testResult: TestExecutionResult): void | Promise<void> {
        console.log(`##teamcity[testFinished nodeId='${test.suite.name}-${test.name}' duration='10']`);
    }
}
