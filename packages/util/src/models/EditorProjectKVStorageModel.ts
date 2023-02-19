/**
 * packages/util/src/models/EditorProjectKVStorageModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.02.2023
 *
 */

import mongoose from "mongoose";

const EditorProjectKVStorage = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EditorProject",
    required: true
  },
  storage: { type: Object }
});

export default mongoose.models?.EditorProjectKVStorage ||
mongoose.model("EditorProjectKVStorage", EditorProjectKVStorage);
