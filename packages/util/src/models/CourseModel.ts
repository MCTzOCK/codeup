/**
 * packages/util/src/models/CourseModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.10.2022
 *
 */
import mongoose from "mongoose";

const Course = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  friendlyName: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  splashImage: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  available: {
    type: Boolean,
    default: false,
    required: true,
  },
  contentPositions: {
    type: [String],
    required: true,
    default: false,
  },
});

export default mongoose.models?.Course || mongoose.model("Course", Course);
