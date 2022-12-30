/**
 * packages/util/src/models/CodeSnippet.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.12.2022
 *
 */

import mongoose from "mongoose";

const Snippet = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

export default mongoose.models?.Snippet || mongoose.model("Snippet", Snippet);
