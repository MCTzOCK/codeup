/**
 * packages/util/src/models/ProjectI18nModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.06.2024
 *
 */

import mongoose from "mongoose";

const ProjectI18nModel = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  defaultLanguage: {
    type: String,
    required: true,
  },
  languages: {
    type: [String],
    required: true,
  },
  translations: {
    type: Object,
    required: true,
  },
});

export default mongoose.models?.ProjectI18n ||
  mongoose.model("ProjectI18n", ProjectI18nModel);
