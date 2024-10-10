/**
 * packages/util/src/models/ToDoListV2Model.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.07.2024
 *
 */

import mongoose from "mongoose";

const ToDoListV2Model = new mongoose.Schema({
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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

export default mongoose.models?.ToDoListV2 ||
  mongoose.model("ToDoListV2", ToDoListV2Model);
