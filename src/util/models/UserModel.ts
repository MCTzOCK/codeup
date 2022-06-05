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

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
        immutable: true,
    },
    twoFactorEnabled: {
        type: Boolean,
        default: false,
        required: true,
    },
    twoFactorCode: {
        type: String,
        default: ""
    },
    active: {
        type: Boolean,
        default: false,
        required: true,
    },
    activationToken: {
        type: String,
        default: "",
    },
    deletionToken: {
        type: String,
        default: "",
    },
    resetToken: {
        type: String,
        default: "",
    },
});

export default mongoose.models?.User || mongoose.model("User", UserSchema);