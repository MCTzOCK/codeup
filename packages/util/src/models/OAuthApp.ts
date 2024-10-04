/**
 * packages/util/src/models/OAuthApp.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.10.2024
 *
 */

import mongoose from "mongoose";

const OAuthApp = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  redirectUris: {
    type: [String],
    required: true,
  },
});

export default mongoose.models?.OAuthApp ||
  mongoose.model("OAuthApp", OAuthApp);
