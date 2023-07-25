/**
 * packages/util/src/models/AskPostModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.06.23
 *
 */

import mongoose from "mongoose";

const AskPostModel = new mongoose.Schema({
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
  embeds: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AskPost",
    default: null,
  },
});

export default mongoose.models?.AskPost ||
  mongoose.model("AskPost", AskPostModel);
