import { describe, expect, test } from "@jest/globals"
import { suite as localSuite, test as localTest } from "@bipolar/meta";
import {
    IExecutionReporter,
    RunContext,
    SuiteExecutionResult,
    SuiteHandle,
    TestExecutionResult,
    TestHandle,
} from "../src/IExecutionReporter";
import { SuiteRunner } from "../src/SuiteRunner";


describe('RunSuite', () => {
    test("runSuiteWithSingleTest", async () => {
        const eventLog: string[] = [];

        @localSuite
        class Suite01 {
            @localTest
            public test01(): void {
                eventLog.push("Suite01 test01");
            }
        }

        const suiteRunner = new SuiteRunner(Suite01);
        await suiteRunner.run(getRunContext());

        expect(eventLog).toEqual(["Suite01 test01"]);
    });

    test("runSuiteWithSingleTestWithError", () => {
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
        await suiteRunner.run(getRunContext());

        expect(eventLog).toEqual(["Suite01 test01"]);
    });


    test("runSuiteWithSingleTestWithErrorWithReporter", () => {
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

        expect(reporter.eventLog).toEqual([
            "StartSuite: Suite01",
            "StartTest: Suite01.test01.",
            "FinishTest: Suite01.test01. Failed",
            "FinishSuite: Suite01. Failed",
        ]);
    })

    function getRunContext(): RunContext {
        return {};
    }
});

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

