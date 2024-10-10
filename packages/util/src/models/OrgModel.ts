/**
 * packages/util/src/models/OrgModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.03.23
 *
 */
import mongoose from "mongoose";

const OrgModel = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  members: {
    type: Array,
    required: true,
    default: [],
  },
  icon: {
    type: String,
    required: false,
    default: "/codeup.png",
  },
  subscription: {
    type: String,
    required: true,
    default: "FREE",
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    immutable: true,
    index: true,
  },
});

export default mongoose.models?.Org || mongoose.model("Org", OrgModel);
