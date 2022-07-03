/**
 * src/util/models/CourseProgressModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.07.2022
 *
 */

import mongoose from "mongoose";

const CourseProgress = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  finishedModules: {
    type: [String],
    required: true,
    default: [],
  },
  finishedCourse: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default mongoose.models?.CourseProgress ||
  mongoose.model("CourseProgress", CourseProgress);
