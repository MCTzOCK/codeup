/**
 * packages/util/src/models/ErrorModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.04.2023
 *
 */

import mongoose from "mongoose";

const ErrorModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  stack: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
    immutable: true,
  },
});

export default mongoose.models?.ErrorModel ||
  mongoose.model("ErrorModel", ErrorModel);
