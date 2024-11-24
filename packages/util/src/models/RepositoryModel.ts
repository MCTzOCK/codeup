/**
 * packages/util/src/models/RepositoryModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.11.2024
 *
 */

import mongoose from "mongoose";

const RepositoryModel = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
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
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  public: {
    type: Boolean,
    required: true,
    default: true,
  },
  // static, docker
  deploymentType: {
    type: String,
    required: true,
    default: "static",
  },
  deploymentName: {
    type: String,
    required: false,
    unique: true,
  },
  lastDeployment: {
    type: Date,
    required: false,
  },
});

export default mongoose.models?.Repository ||
  mongoose.model("Repository", RepositoryModel);
