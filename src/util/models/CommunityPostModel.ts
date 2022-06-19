/**
 * src/util/models/CommunityPostModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.06.2022
 *
 */


import mongoose from "mongoose";
import {ObjectId} from "mongodb";

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
        minlength: 1
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
    }
});


export default mongoose.models?.CommunityPost || mongoose.model("CommunityPost", CommunityPost);