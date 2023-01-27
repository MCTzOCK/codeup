/**
 * packages/util/src/models/EditorProjectModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.01.2023
 *
 */

import mongoose from "mongoose";

const EditorProject = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  contributors: {
    type: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        permissions: {
          type: [String],
          required: true,
          /*
           * Permissions
           * READ; WRITE; DELETE; DUPLICATE; MANAGE-CONTRIBUTORS; RENAME; EXPORT
           */
          default: ["READ", "WRITE", "DUPLICATE"],
        },
      },
    ],
    required: true,
    default: [],
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  created_at: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  pinned: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  published: {
    type: Boolean,
    default: false,
  },
  publishedCustomName: {
    type: String,
    default: "",
  },
  discovery: {
    type: Boolean,
    default: false,
  },
  discoveryDescription: {
    type: String,
    default: "",
  },
  customDomain: {
    type: String,
    default: "",
    unique: true,
  },
});

export default mongoose.models?.EditorProject ||
  mongoose.model("EditorProject", EditorProject);
