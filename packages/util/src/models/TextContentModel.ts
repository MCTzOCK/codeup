/**
 * packages/util/src/models/TextContentModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.10.2022
 *
 */
import mongoose from "mongoose";

const TextContent = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  friendlyName: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
    index: true,
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
    required: true,
  },
});

export default mongoose.models?.TextContent ||
  mongoose.model("TextContent", TextContent);
