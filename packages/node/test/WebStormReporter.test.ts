import { describe, expect, test } from "@jest/globals"
import { suite as localSuite, test as localTest } from "@bipolar/meta";
import { RunContext, } from "../src/IExecutionReporter";
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


// ##teamcity[enteredTheMatrix]

// ##teamcity[testCount count='1']
// ##teamcity[testSuiteStarted
//      nodeId='16776_68872_767484500-1'
//      parentNodeId='C:\workspace\keforms\keforms.engine\Engine\test\Engine\PathUtils.test.ts'
//      name='PathUtilsTest'
//      running='true'
//      nodeType='suite'
//      locationHint='suite://C:\\workspace\\keforms\\keforms\.engine\\Engine\\test\\Engine\\PathUtils\.test\.ts.PathUtilsTest']
// ##teamcity[testStarted nodeId='16776_68872_767484500-2' parentNodeId='16776_68872_767484500-1' name='testGetAbsolutePath' running='true' nodeType='test' locationHint='test://C:\\workspace\\keforms\\keforms\.engine\\Engine\\test\\Engine\\PathUtils\.test\.ts.PathUtilsTest.testGetAbsolutePath']
// ##teamcity[testSuiteFinished nodeId='C:\workspace\keforms\keforms.engine\Engine\test\Engine\PathUtils.test.ts']
