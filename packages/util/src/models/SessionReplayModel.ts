/**
 * packages/util/src/models/SessionReplayModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.07.2024
 *
 */

import mongoose from "mongoose";

const SessionReplayModel = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  events: {
    type: Array,
    required: true,
    default: [],
  },
  sessionStarted: {
    type: Date,
    required: true,
    default: Date.now,
  },
  userAgent: {
    type: String,
    required: true,
  },
});

export default mongoose.models?.SessionReplay ||
  mongoose.model("SessionReplay", SessionReplayModel);
