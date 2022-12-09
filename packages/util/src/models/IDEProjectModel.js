/**
 * packages/util/src/models/IDEProjectModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.07.2022
 *
 */
var _a;
import mongoose from "mongoose";
const IDEProject = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    contributors: {
        type: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                permissions: {
                    type: [String],
                    required: true,
                    /*
                     * Permissions
                     * READ; WRITE; DELETE; DUPLICATE; MANAGE-CONTRIBUTORS; RENAME; EXPORT
                     */
                    default: ["READ", "WRITE", "DUPLICATE"],
                },
            },
        ],
        required: true,
        default: [],
    },
    files: {
        type: [
            {
                path: {
                    type: String,
                    default: "/README.MD",
                },
                content: {
                    type: String,
                    default: "# Readme\nWillkommen im CodeUp Editor!",
                },
            },
        ],
        required: true,
        default: [{}],
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    created_at: {
        type: Date,
        default: Date.now,
        immutable: true,
    },
    pinned: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
    },
    published: {
        type: Boolean,
        default: false,
    },
    publishedCustomName: {
        type: String,
        default: "",
    },
});
export default ((_a = mongoose.models) === null || _a === void 0 ? void 0 : _a.IDEProject) ||
    mongoose.model("IDEProject", IDEProject);
