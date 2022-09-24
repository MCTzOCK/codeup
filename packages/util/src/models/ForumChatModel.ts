/**
 * packages/util/src/models/ForumProfileModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.09.2022
 *
 */

import mongoose from "mongoose";

const ForumChat = new mongoose.Schema({
  users: {
    type: [String],
    required: true,
  },
  messages: {
    type: [
      {
        username: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
          immutable: true,
        },
      },
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

export default mongoose.models?.ForumChat ||
  mongoose.model("ForumChat", ForumChat);
