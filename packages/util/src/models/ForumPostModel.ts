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

const ForumPost = new mongoose.Schema({
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
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
    index: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ForumPost",
    default: null,
  },
  embeds: {
    type: Array,
    default: [],
  },
});

export default mongoose.models?.ForumPost ||
  mongoose.model("ForumPost", ForumPost);
