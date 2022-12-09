/**
 * packages/util/src/models/ContactModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.11.2022
 *
 */
var _a;
import mongoose from "mongoose";
const Contact = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true,
        required: true,
    },
    category: {
        type: String,
        required: true,
        default: "sonstiges",
    },
    title: {
        type: String,
        required: true,
    },
});
export default ((_a = mongoose.models) === null || _a === void 0 ? void 0 : _a.Contact) || mongoose.model("Contact", Contact);
