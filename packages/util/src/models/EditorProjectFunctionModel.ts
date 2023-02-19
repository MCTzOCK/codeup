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

const EditorProjectFunction = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EditorProject",
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    default: "",
  }
});

export default mongoose.models?.EditorProjectFunction ||
  mongoose.model("EditorProjectFunction", EditorProjectFunction);
