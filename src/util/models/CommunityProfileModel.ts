/**
 * src/util/models/UserModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.06.2022
 *
 */

import mongoose from "mongoose";
import {ObjectId} from "mongodb";

const CommunityProfile = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    profilePicture: {
        type: String,
        default: "https://static.content.ben-siebert.de/api/public/dl/lSFt9Tkg",
        required: true,
    },
    profileBanner: {
        type: String,
        default: "https://static.content.ben-siebert.de/api/public/dl/92eo0fdj",
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    specialStatus: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },
    website: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        default: "",
    },
    birthday: {
        type: String,
        default: "2007-20-03",
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true,
    },
    sexuality: {
        type: String,
        default: "",
    },
    gender: {
        type: String,
        default: "",
    },
    followers: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        default: [],
        required: true,
    },
});

export default mongoose.models?.CommunityProfile || mongoose.model("CommunityProfile", CommunityProfile);