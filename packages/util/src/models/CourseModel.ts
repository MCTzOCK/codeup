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
    index: true,
  },
  // PUBLIC (editor and admin only) | PRIVATE | ORG:ORG_ID (org owner only)
  available: {
    type: String,
    default: false,
    required: true,
  },
  contentPositions: {
    type: [String],
    required: true,
    default: false,
  },
  creator: {
    type: String,
    required: true,
  },
  interactive: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default mongoose.models?.Course || mongoose.model("Course", Course);
