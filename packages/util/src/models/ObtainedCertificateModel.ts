/**
 * packages/util/src/models/Certificate.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.11.2022
 *
 */
import mongoose from "mongoose";

const ObtainedCertificate = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Course",
  },
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    index: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  screenshot: {
    type: String,
    required: false,
  },
});

export default mongoose.models?.ObtainedCertificate ||
  mongoose.model("ObtainedCertificate", ObtainedCertificate);
