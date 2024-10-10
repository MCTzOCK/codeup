/**
 * packages/util/src/models/UserAIChatModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.07.2024
 *
 */

import mongoose from "mongoose";

const UserAIChatModel = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messages: {
    type: Array,
    required: true,
    default: [],
  },
});

export default mongoose.models?.UserAIChat ||
  mongoose.model("UserAIChat", UserAIChatModel);
