/**
 * packages/util/src/models/InteractiveSectionModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 29.08.2024
 *
 */

import mongoose from "mongoose";

const InteractiveSectionModel = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  title: {
    type: String,
    required: true,
  },
  introduction: {
    type: String,
    required: true,
  },
  steps: {
    type: [
      {
        text: {
          type: String,
          required: true,
        },
        code: {
          type: String,
          required: true,
        },
        language: {
          type: String,
          required: true,
        },
        correct: {
          type: String,
          required: true,
        },
        task: {
          type: String,
          required: true,
        },
      },
    ],
    required: true,
  },
});

export default mongoose.models?.InteractiveSection ||
  mongoose.model("InteractiveSection", InteractiveSectionModel);
