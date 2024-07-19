/**
 * packages/util/src/models/UserAIQuotaModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.07.2024
 *
 */

import mongoose from "mongoose";

const UserAIQuotaModel = new mongoose.Schema({
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
  available: {
    type: Number,
    required: true,
    default: 20,
  },
  resetsAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export default mongoose.models?.UserAIQuota ||
  mongoose.model("UserAIQuota", UserAIQuotaModel);
