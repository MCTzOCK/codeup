/**
 * packages/util/src/models/CompletedUserChallenges.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.05.2024
 *
 */

import mongoose from "mongoose";

const CompletedUserChallenges = new mongoose.Schema({
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
  challenges: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: "Challenge",
  },
});

export default mongoose.models?.CompletedUserChallenges ||
  mongoose.model("CompletedUserChallenges", CompletedUserChallenges);
