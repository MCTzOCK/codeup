/**
 * apps/observability/src/models/PageViewModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.10.2024
 *
 */

import mongoose from "mongoose";

const PageViewModel = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
  browser: {
    type: String,
    required: false,
  },
  os: {
    type: String,
    required: false,
  },
  language: {
    type: String,
    required: false,
  },
  screenResolution: {
    type: String,
    required: false,
  },
  viewport: {
    type: String,
    required: false,
  },
  ip: {
    type: String,
    required: false,
  },
});

export default mongoose.models?.PageView ||
  mongoose.model("PageView", PageViewModel);
