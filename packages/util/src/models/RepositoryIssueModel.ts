/**
 * packages/util/src/models/RepositoryIssueModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.12.2024
 *
 */

import mongoose from "mongoose";

const RepositoryIssueModel = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  repository: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Repository",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "open",
  },
});

export default mongoose.models?.RepositoryIssue ||
  mongoose.model("RepositoryIssue", RepositoryIssueModel);
