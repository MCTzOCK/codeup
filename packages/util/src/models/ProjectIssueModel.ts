/**
 * packages/util/src/models/ProjectIssueModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 31.05.2024
 *
 */

import mongoose from "mongoose";

const ProjectIssueModel = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "open",
  },
  priority: {
    type: String,
    required: true,
    default: "normal",
  },
});

export default mongoose.models?.ProjectIssue ||
  mongoose.model("ProjectIssue", ProjectIssueModel);
