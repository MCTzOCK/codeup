/**
 * packages/util/src/models/ForumProfileModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.09.2022
 *
 */

import mongoose from "mongoose";

const ForumProfile = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
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
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  badges: {
    type: [String],
    default: [],
  },
  certificates: {
    type: [String],
    default: [],
  },
});

export default mongoose.models?.ForumProfile ||
  mongoose.model("ForumProfile", ForumProfile);
