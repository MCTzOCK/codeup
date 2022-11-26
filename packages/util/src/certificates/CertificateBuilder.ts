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
  private certificate: any = {};

  constructor() {
    this.certificate.steps = [];
  }

  setCourse(course: string): CertificateBuilder {
    this.certificate.course = course;
    return this;
  }

  setMinPercentage(percentage: number): CertificateBuilder {
    this.certificate.minPercentage = percentage;
    return this;
  }

  addStep(step: any): CertificateBuilder {
    this.certificate.steps.push(step);
    return this;
  }

  build(): any {
    return this.certificate;
  }
}

export class MultipleChoiceBuilder {
  private step: any = {};

  constructor() {
    this.step.step_type = "MULTIPLE_CHOICE";
    this.step.step_title = "";
    this.step.multiple_choice = {};
    this.step.multiple_choice.answers = [];
  }

  setTitle(title: string): MultipleChoiceBuilder {
    this.step.step_title = title;
    return this;
  }

  setQuestion(question: string): MultipleChoiceBuilder {
    this.step.multiple_choice.question = question;
    return this;
  }

  addAnswer(answer: string, correct: boolean): MultipleChoiceBuilder {
    this.step.multiple_choice.answers.push({
      answer,
      correct,
    });
    return this;
  }

  build(): any {
    return this.step;
  }
}

export class TextBuilder {
  private step: any = {};

  constructor() {
    this.step.step_type = "TEXT";
    this.step.step_title = "";
    this.step.textParts = [];
  }

  setTitle(title: string): TextBuilder {
    this.step.step_title = title;
    return this;
  }

  addText(text: string): TextBuilder {
    this.step.textParts.push({
      type: "TEXT",
      value: text,
    });
    return this;
  }

  addInput(correct: string): TextBuilder {
    this.step.textParts.push({
      type: "INPUT",
      value: correct,
    });
    return this;
  }

  build(): any {
    return this.step;
  }
}

export class CodeCompareBuilder {
  private step: any = {};

  constructor() {
    this.step.step_type = "CODE_COMPARE";
    this.step.step_title = "";
    this.step.code_compare = {};
  }

  setTitle(title: string): CodeCompareBuilder {
    this.step.step_title = title;
    return this;
  }

  setCodeA(code: string, correct: boolean): CodeCompareBuilder {
    this.step.code_compare.code_a = {
      code,
      correct,
    };
    return this;
  }

  setCodeB(code: string, correct: boolean): CodeCompareBuilder {
    this.step.code_compare.code_b = {
      code,
      correct,
    };
    return this;
  }

  setOutput(screenshotURL: string): CodeCompareBuilder {
    this.step.code_compare.output = screenshotURL;
    return this;
  }

  build(): any {
    return this.step;
  }
}

export class CodeCheckBuilder {
  private step: any = {};

  constructor() {
    this.step.step_type = "CODE_CHECK";
    this.step.step_title = "";
    this.step.code_check = {};
  }

  setTitle(title: string): CodeCheckBuilder {
    this.step.step_title = title;
    return this;
  }

  setCodeA(screenshotURL: string, correct: boolean): CodeCheckBuilder {
    this.step.code_check.code_a = {
      screenshot: screenshotURL,
      correct,
    };
    return this;
  }

  setCodeB(screenshotURL: string, correct: boolean): CodeCheckBuilder {
    this.step.code_check.code_b = {
      screenshot: screenshotURL,
      correct,
    };
    return this;
  }

  build(): any {
    return this.step;
  }
}
