/**
 * src/util/models/CommunityPostModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.06.2022
 *
 */
var _a;
import mongoose from "mongoose";
const CommunityPost = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
        minlength: 1,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
        immutable: true,
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        required: true,
    },
    comments: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        required: true,
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CommunityPost",
        default: null,
    },
});
export default ((_a = mongoose.models) === null || _a === void 0 ? void 0 : _a.CommunityPost) ||
    mongoose.model("CommunityPost", CommunityPost);
