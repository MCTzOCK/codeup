/**
 * packages/util/src/models/CodeChallengeModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.05.2024
 *
 */

import mongoose from "mongoose";

const CodeChallengeModel = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  difficulty: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
    required: true,
  },
});

export default mongoose.models?.CodeChallenge ||
  mongoose.model("CodeChallenge", CodeChallengeModel);
