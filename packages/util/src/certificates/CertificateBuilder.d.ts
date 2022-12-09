/**
 * packages/util/src/certificates/CertificateBuilder.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.11.2022
 *
 */
export declare class CertificateBuilder {
    private certificate;
    constructor();
    setCourse(course: string): CertificateBuilder;
    setMinPercentage(percentage: number): CertificateBuilder;
    addStep(step: any): CertificateBuilder;
    build(): any;
}
export declare class MultipleChoiceBuilder {
    private step;
    constructor();
    setTitle(title: string): MultipleChoiceBuilder;
    setQuestion(question: string): MultipleChoiceBuilder;
    addAnswer(answer: string, correct: boolean): MultipleChoiceBuilder;
    build(): any;
}
export declare class TextBuilder {
    private step;
    constructor();
    setTitle(title: string): TextBuilder;
    addText(text: string): TextBuilder;
    addInput(correct: string): TextBuilder;
    build(): any;
}
export declare class CodeCompareBuilder {
    private step;
    constructor();
    setTitle(title: string): CodeCompareBuilder;
    setCodeA(code: string, correct: boolean): CodeCompareBuilder;
    setCodeB(code: string, correct: boolean): CodeCompareBuilder;
    setOutput(screenshotURL: string): CodeCompareBuilder;
    build(): any;
}
export declare class CodeCheckBuilder {
    private step;
    constructor();
    setTitle(title: string): CodeCheckBuilder;
    setCodeA(screenshotURL: string, correct: boolean): CodeCheckBuilder;
    setCodeB(screenshotURL: string, correct: boolean): CodeCheckBuilder;
    build(): any;
}
//# sourceMappingURL=CertificateBuilder.d.ts.map