/**
 * src/util/models/CourseStatsModels.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.06.2022
 *
 */

import mongoose from "mongoose";

const CourseStats = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  started: {
    type: Boolean,
    required: true,
  },
  currentSection: {
    type: String,
    required: true,
  },
  finished: {
    type: Boolean,
    required: true,
  },
});

export default mongoose.models?.CourseStats ||
  mongoose.model("CourseStats", CourseStats);
