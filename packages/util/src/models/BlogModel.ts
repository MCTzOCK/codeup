/**
 * packages/util/src/models/BlogModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.12.2022
 *
 */
import mongoose from "mongoose";

const Blog = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  authorUsername: {
    type: String,
    required: true,
  },
  published_at: {
    type: Date,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  comments: {
    type: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
        authorUsername: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        published_at: {
          type: Date,
          required: true,
        },
      },
    ],
    required: true,
    default: [],
  },
});

export default mongoose.models?.Blog || mongoose.model("Blog", Blog);
