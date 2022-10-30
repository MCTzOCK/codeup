/**
 * packages/util/src/models/VideoModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.10.2022
 *
 */
import mongoose from "mongoose";

const Video = new mongoose.Schema({
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
  transcript: {
    type: String,
    required: true,
  },
  youtube: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  available: {
    type: Boolean,
    default: false,
    required: true,
  },
  quiz: {
    // questions
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

export default mongoose.models?.Video || mongoose.model("Video", Video);
