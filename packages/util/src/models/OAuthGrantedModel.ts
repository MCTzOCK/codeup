/**
 * packages/util/src/models/OAuthGrantedModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.10.2024
 *
 */

import mongoose from "mongoose";

const OAuthGrantedModel = new mongoose.Schema({
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
  app: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "OAuthApp",
  },
});

export default mongoose.models?.OAuthGranted ||
  mongoose.model("OAuthGranted", OAuthGrantedModel);
