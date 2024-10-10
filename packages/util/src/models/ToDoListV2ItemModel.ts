/**
 * packages/util/src/models/ToDoListV2ItemModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.07.2024
 *
 */

import mongoose from "mongoose";

const ToDoListV2ItemModel = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
    required: true,
    default: false,
  },
  description: {
    type: String,
    required: false,
  },
  list: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "ToDoListV2",
  },
});

export default mongoose.models?.ToDoListV2Item ||
  mongoose.model("ToDoListV2Item", ToDoListV2ItemModel);
