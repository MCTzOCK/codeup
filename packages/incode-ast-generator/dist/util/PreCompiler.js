"use strict";
/**
 * packages/incode-ast-generator/util/PreCompiler.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.08.2022
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreCompiler = void 0;
// THIS CODE SNIPPET WAS ORIGINALLY CREATED BY BEN SIEBERT FOR THE INCODE PROGRAMMING LANGUAGE
//
//
// Original: https://github.com/InCodeDevs/InCode/blob/63f73726d0a02a96a023e0ec81aef3504ffe4f1d/packages/compiler/src/util/PreCompiler.ts#L6
// Copyright © Ben Siebert
var PreCompiler = /** @class */ (function () {
    function PreCompiler() {
    }
    PreCompiler.preCompile = function (source) {
        source = source.replace(/ {2}/g, "");
        source = source.replace(/\r/g, "");
        return source;
    };
    return PreCompiler;
}());
exports.PreCompiler = PreCompiler;
//# sourceMappingURL=PreCompiler.js.map