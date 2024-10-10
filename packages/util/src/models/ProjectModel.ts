/**
 * packages/util/src/models/ProjectModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.05.2024
 *
 */

import mongoose from "mongoose";

const ProjectModel = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: true,
  },
  users: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  projectType: {
    type: String,
    required: true,
    default: "static",
  },
  modifiers: {
    type: [String],
    required: true,
    default: [],
  },
});

export default mongoose.models?.Project ||
  mongoose.model("Project", ProjectModel);
