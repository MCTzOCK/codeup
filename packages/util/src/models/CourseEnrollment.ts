/**
 * packages/util/src/models/CourseEnrollment.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.05.2024
 *
 */

import mongoose from "mongoose";

const CourseEnrollmentModel = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Course",
  },
});

export default mongoose.models?.CourseEnrollment ||
  mongoose.model("CourseEnrollment", CourseEnrollmentModel);
