/**
 * packages/util/src/models/ContentModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.11.2022
 *
 */

import mongoose from "mongoose";

const Content = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  textContent: {
    type: String,
    required: false,
  },
  quiz: {
    type: [
      {
        question: {
          type: String,
          required: true,
        },
        answers: {
          type: [
            {
              answer: {
                type: String,
                required: true,
              },
              correct: {
                type: Boolean,
                required: true,
              },
            },
          ],
        },
      },
    ],
  },
  videoUrl: {
    type: String,
    required: false,
  },
  creator: {
    type: String,
    required: true,
  },
});

export default mongoose.models?.Content || mongoose.model("Content", Content);
