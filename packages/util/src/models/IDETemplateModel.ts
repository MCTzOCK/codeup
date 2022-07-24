/**
 * packages/util/src/models/IDETemplateModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.07.2022
 *
 */
import mongoose from "mongoose";

const IDETemplate = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "IDEProject",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ratings: {
    type: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
      },
    ],
    required: true,
  },
  uses: {
    type: Number,
    default: 0,
  },
});

export default mongoose.models?.IDETemplate ||
  mongoose.model("IDETemplate", IDETemplate);
