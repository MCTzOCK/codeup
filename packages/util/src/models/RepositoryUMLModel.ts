/**
 * packages/util/src/models/RepositoryUMLModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 15.12.2024
 *
 */

import mongoose from "mongoose";

const RepositoryUMLModel = new mongoose.Schema({
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
  name: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

export default mongoose.models?.RepositoryUML ||
  mongoose.model("RepositoryUML", RepositoryUMLModel);
