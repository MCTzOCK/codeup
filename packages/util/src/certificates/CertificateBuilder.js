/**
 * packages/util/src/certificates/CertificateBuilder.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.11.2022
 *
 */
export class CertificateBuilder {
    constructor() {
        this.certificate = {};
        this.certificate.steps = [];
    }
    setCourse(course) {
        this.certificate.course = course;
        return this;
    }
    setMinPercentage(percentage) {
        this.certificate.minPercentage = percentage;
        return this;
    }
    addStep(step) {
        this.certificate.steps.push(step);
        return this;
    }
    build() {
        return this.certificate;
    }
}
export class MultipleChoiceBuilder {
    constructor() {
        this.step = {};
        this.step.step_type = "MULTIPLE_CHOICE";
        this.step.step_title = "";
        this.step.multiple_choice = {};
        this.step.multiple_choice.answers = [];
    }
    setTitle(title) {
        this.step.step_title = title;
        return this;
    }
    setQuestion(question) {
        this.step.multiple_choice.question = question;
        return this;
    }
    addAnswer(answer, correct) {
        this.step.multiple_choice.answers.push({
            answer,
            correct,
        });
        return this;
    }
    build() {
        return this.step;
    }
}
export class TextBuilder {
    constructor() {
        this.step = {};
        this.step.step_type = "TEXT";
        this.step.step_title = "";
        this.step.text_parts = [];
    }
    setTitle(title) {
        this.step.step_title = title;
        return this;
    }
    addText(text) {
        this.step.text_parts.push({
            type: "TEXT",
            value: text,
        });
        return this;
    }
    addInput(correct) {
        this.step.text_parts.push({
            type: "INPUT",
            value: correct,
        });
        return this;
    }
    build() {
        return this.step;
    }
}
export class CodeCompareBuilder {
    constructor() {
        this.step = {};
        this.step.step_type = "CODE_COMPARE";
        this.step.step_title = "";
        this.step.code_compare = {};
    }
    setTitle(title) {
        this.step.step_title = title;
        return this;
    }
    setCodeA(code, correct) {
        this.step.code_compare.code_a = {
            code,
            correct,
        };
        return this;
    }
    setCodeB(code, correct) {
        this.step.code_compare.code_b = {
            code,
            correct,
        };
        return this;
    }
    setOutput(screenshotURL) {
        this.step.code_compare.output = screenshotURL;
        return this;
    }
    build() {
        return this.step;
    }
}
export class CodeCheckBuilder {
    constructor() {
        this.step = {};
        this.step.step_type = "CODE_CHECK";
        this.step.step_title = "";
        this.step.code_check = {};
    }
    setTitle(title) {
        this.step.step_title = title;
        return this;
    }
    setCodeA(screenshotURL, correct) {
        this.step.code_check.code_a = {
            screenshot: screenshotURL,
            correct,
        };
        return this;
    }
    setCodeB(screenshotURL, correct) {
        this.step.code_check.code_b = {
            screenshot: screenshotURL,
            correct,
        };
        return this;
    }
    build() {
        return this.step;
    }
}
