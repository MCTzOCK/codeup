/**
 * packages/util/src/models/AnalyticsModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.11.2022
 *
 */
var _a;
import mongoose from "mongoose";
const Analytics = new mongoose.Schema({
    loggedIn: {
        type: Boolean,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
        required: false,
    },
    path: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
        immutable: true,
    },
    browser: {
        type: String,
        required: true,
    },
    os: {
        type: String,
        required: true,
    },
});
export default ((_a = mongoose.models) === null || _a === void 0 ? void 0 : _a.Analytics) ||
    mongoose.model("Analytics", Analytics);
