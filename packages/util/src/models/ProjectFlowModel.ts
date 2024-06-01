/**
 * packages/util/src/models/ProjectFlowModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.06.2024
 *
 */

import mongoose from "mongoose";

const ProjectFlowModel = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  name: {
    type: String,
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Project",
  },
  saved: {
    type: "Mixed",
    required: true,
  },
});

export default mongoose.models?.ProjectFlow ||
  mongoose.model("ProjectFlow", ProjectFlowModel);
