import { expect } from "../../Tests/BrowserTestsCore/Expect";

import { suite as localSuite, SuiteRunner, test as localTest } from "../src/Attributes";
import {
    IExecutionReporter,
    RunContext,
    SuiteExecutionResult,
    SuiteHandle, TestExecutionResult,
    TestHandle,
} from "../src/IExecutionReporter";

@suite
export class RunSuiteTest {
    @test
    public async runSuiteWithSingleTest(): Promise<void> {
        const eventLog: string[] = [];

        @localSuite
        class Suite01 {
            @localTest
            public test01(): void {
                eventLog.push("Suite01 test01");
            }
        }

        const suiteRunner = new SuiteRunner(Suite01);
        await suiteRunner.run(this.getRunContext());

        expect(eventLog).to.eql(["Suite01 test01"]);
    }

    @test
    public async runSuiteWithSingleTestWithError(): Promise<void> {
        const eventLog: string[] = [];

        @localSuite
        class Suite01 {
            @localTest
            public test01(): void {
                eventLog.push("Suite01 test01");
                throw new Error("Any error in test");
            }
        }

        const suiteRunner = new SuiteRunner(Suite01);
        await suiteRunner.run(this.getRunContext());

        expect(eventLog).to.eql(["Suite01 test01"]);
    }

    @test
    public async runSuiteWithSingleTestWithErrorWithReporter(): Promise<void> {
        const reporter = new EventLogReporter();

        @localSuite
        class Suite01 {
            @localTest
            public test01(): void {
                throw new Error("Any error in test");
            }
        }

        const suiteRunner = new SuiteRunner(Suite01, reporter);
        await suiteRunner.run(this.getRunContext());

        expect(reporter.eventLog).to.eql([
            "StartSuite: Suite01",
            "StartTest: Suite01.test01.",
            "FinishTest: Suite01.test01. Failed",
            "FinishSuite: Suite01. Failed",
        ]);
    }

    private getRunContext(): RunContext {
        return {};
    }
}

class EventLogReporter implements IExecutionReporter {
    public readonly eventLog: string[] = [];

    public onStartRun(context: RunContext): void | Promise<void> {
        this.eventLog.push("StartRun");
    }

    public onFinishRun(context: RunContext): void | Promise<void> {
        this.eventLog.push("FinishRun");
    }

    public onStartSuite(suite: SuiteHandle): void | Promise<void> {
        this.eventLog.push(`StartSuite: ${suite.name}`);
    }

    public onFinishSuite(suite: SuiteHandle, suiteResult: SuiteExecutionResult): void | Promise<void> {
        this.eventLog.push(`FinishSuite: ${suite.name}. ${suiteResult.status}`);
    }

    public onStartTest(test: TestHandle): void | Promise<void> {
        this.eventLog.push(`StartTest: ${test.suite.name}.${test.name}.`);
    }

    public onFinishTest(test: TestHandle, testResult: TestExecutionResult): void | Promise<void> {
        this.eventLog.push(`FinishTest: ${test.suite.name}.${test.name}. ${testResult.status}`);
    }
}

