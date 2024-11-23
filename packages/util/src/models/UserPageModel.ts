/**
 * packages/util/src/models/UserPageModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.11.2024
 *
 */

import mongoose from "mongoose";

const UserPageModel = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  links: {
    type: [String],
    required: true,
    default: [],
  },
  readme: {
    type: String,
    required: false,
    default: "",
  },
});

export default mongoose.models?.UserPage ||
  mongoose.model("UserPage", UserPageModel);
