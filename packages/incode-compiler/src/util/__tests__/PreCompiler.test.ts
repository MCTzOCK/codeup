/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */

import { PreCompiler } from "../PreCompiler";

test("Remove Whitespaces", () => {
  expect(PreCompiler.preCompile("W  hitespaces")).toBe("Whitespaces");
});

test("Remove Escape Characters", () => {
  expect(PreCompiler.preCompile("\r")).toBe("");
});
