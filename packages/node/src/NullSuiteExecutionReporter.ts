import { IExecutionReporter } from "./IExecutionReporter";

export class NullSuiteExecutionReporter implements IExecutionReporter {
    public onFinishRun(): void | Promise<void> {
        // noop
    }

    public onFinishSuite(): void | Promise<void> {
        // noop
    }

    public onFinishTest(): void | Promise<void> {
        // noop
    }

    public onStartRun(): void | Promise<void> {
        // noop
    }

    public onStartSuite(): void | Promise<void> {
        // noop
    }

    public onStartTest(): void | Promise<void> {
        // noop
    }

}

export const nullSuiteExecutionReporter = new NullSuiteExecutionReporter();
