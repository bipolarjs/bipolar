export const suiteMetadataAttr = Symbol.for("bipolar:SuiteMetadata");

export interface SuiteMetadataContainer {
    [suiteMetadataAttr]?: SuiteMetadata;
}

export const suite: ClassDecorator = (classConstructor: Function) => {
    const suiteContainer: SuiteMetadataContainer = classConstructor as SuiteMetadataContainer;
    suiteContainer[suiteMetadataAttr] = suiteContainer[suiteMetadataAttr] ?? {tests: []};
};

export const test: MethodDecorator = (classObject: Object, name: string | symbol): void => {
    const suiteContainer: SuiteMetadataContainer = classObject.constructor as SuiteMetadataContainer;
    suiteContainer[suiteMetadataAttr] = suiteContainer[suiteMetadataAttr] ?? {tests: []};
    suiteContainer[suiteMetadataAttr]?.tests.push({
        name: name.toString(),
    });
};

export interface TestMetadata {
    name: string;
}

export interface SuiteMetadata {
    tests: TestMetadata[];
}
