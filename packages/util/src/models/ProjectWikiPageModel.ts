/**
 * packages/util/src/models/ProjectWikiPageModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 31.05.2024
 *
 */

import mongoose from "mongoose";

const ProjectWikiPageModel = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Project",
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

export default mongoose.models?.ProjectWikiPage ||
  mongoose.model("ProjectWikiPage", ProjectWikiPageModel);
