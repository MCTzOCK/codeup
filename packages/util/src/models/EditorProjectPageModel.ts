/**
 * packages/util/src/models/EditorProjectPageModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.01.2023
 *
 */

import mongoose from "mongoose";

const EditorProjectPage = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EditorProject",
    required: true,
  },
  type: {
    type: String,
    required: true,
    // Types: HTML; InCode
    default: "html",
  },
  mainContent: {
    type: String,
    required: true,
    default: "",
  },
  resources: {
    type: Array,
    required: true,
    default: [],
  },
  url: {
    type: String,
    default: "",
    required: true,
  },
});

export default mongoose.models?.EditorProjectPage ||
  mongoose.model("EditorProjectPage", EditorProjectPage);
