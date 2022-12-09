/**
 * packages/util/src/models/ToDoProjectModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.12.2022
 *
 */
var _a;
import mongoose from "mongoose";
const ToDoProject = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    saved: {
        type: "Mixed",
        required: true,
    },
});
export default ((_a = mongoose.models) === null || _a === void 0 ? void 0 : _a.ToDoProject) ||
    mongoose.model("ToDoProject", ToDoProject);
