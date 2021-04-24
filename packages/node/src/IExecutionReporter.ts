export interface RunContext {

}

export interface SuiteHandle {
    context: RunContext;
    name: string;
}

export interface TestHandle {
    context: RunContext;
    suite: SuiteHandle;
    name: string;
}

export interface SuiteExecutionResult {
    status: SuiteStatus;
}

export enum SuiteStatus {
    Passed = "Passed",
    Failed = "Failed",
}

export enum TestStatus {
    Passed = "Passed",
    Failed = "Failed",
    Ignored = "Ignored",
}

export interface TestExecutionResult {
    status: TestStatus;
}

export interface ISuiteExecutionReporter {
    onStartSuite(suite: SuiteHandle): void | Promise<void>;
    onStartTest(test: TestHandle): void | Promise<void>;
    onFinishTest(test: TestHandle, testResult: TestExecutionResult): void | Promise<void>;
    onFinishSuite(suite: SuiteHandle, suiteResult: SuiteExecutionResult): void | Promise<void>;
}

export interface IExecutionReporter extends ISuiteExecutionReporter {
    onStartRun(context: RunContext): void | Promise<void>;
    onFinishRun(context: RunContext): void | Promise<void>;
}


