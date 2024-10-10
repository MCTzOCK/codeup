/**
 * packages/util/src/models/UserXPModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.07.2024
 *
 */

import mongoose from "mongoose";

const UserXPModel = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    unique: true,
  },
  level: {
    type: Number,
    required: true,
    default: 0,
  },
  xp: {
    type: Number,
    required: true,
    default: 0,
  },
  transactions: {
    type: Array,
    required: true,
    default: [],
  },
});

export default mongoose.models?.UserXP || mongoose.model("UserXP", UserXPModel);
