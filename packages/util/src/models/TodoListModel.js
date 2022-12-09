var _a;
/**
 * packages/util/src/models/TodoListModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.07.2022
 *
 */
import mongoose from "mongoose";
const TodoSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    tasks: {
        type: [
            {
                finished: {
                    type: Boolean,
                    required: true,
                    default: false,
                },
                name: {
                    type: String,
                    required: true,
                },
                uuid: {
                    type: String,
                    required: true,
                },
            },
        ],
        required: true,
        default: [],
    },
});
export default ((_a = mongoose.models) === null || _a === void 0 ? void 0 : _a.Todo) || mongoose.model("Todo", TodoSchema);
