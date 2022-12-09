/**
 * src/util/models/UserModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.06.2022
 *
 */
var _a;
import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        maxlength: 30,
        minlength: 4,
    },
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
        default: "",
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
    emailChangeCode: {
        type: String,
        default: "",
    },
    newEmail: {
        type: String,
        default: "",
    },
    profilePicture: {
        type: String,
        default: "",
    },
    sso: {
        type: String,
        default: "no-sso",
    },
    role: {
        type: String,
        default: "user",
    },
});
export default ((_a = mongoose.models) === null || _a === void 0 ? void 0 : _a.User) || mongoose.model("User", UserSchema);
