/**
 * apps/observability/src/models/SessionReplayModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.10.2024
 *
 */
import mongoose from "mongoose";

const SessionReplayModel = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: true,
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true,
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
