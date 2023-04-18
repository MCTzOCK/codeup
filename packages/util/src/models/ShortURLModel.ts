/**
 * packages/util/src/models/ShortURLModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.04.2023
 *
 */
import mongoose from "mongoose";

const ShortURLModel = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  destination: {
    type: String,
    required: true,
  },
  short: {
    type: String,
    required: true,
  },
});

export default mongoose.models?.ShortURL ||
  mongoose.model("ShortURL", ShortURLModel);
