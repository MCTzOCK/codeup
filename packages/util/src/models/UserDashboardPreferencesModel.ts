/**
 * packages/util/src/models/UserDashboardPreferencesModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.07.2024
 *
 */

import mongoose from "mongoose";

const UserDashboardPreferencesModel = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    unique: true,
  },
  sections: {
    type: [String],
    required: true,
    default: [
      "codeup.courses",
      "codeup.certificates",
      "codeup.todos",
      "codeup.kids",
      "codeup.flows",
      "codeup.snippets",
      "codeup.projects",
    ],
  },
});

export default mongoose.models?.UserDashboardPreferences ||
  mongoose.model("UserDashboardPreferences", UserDashboardPreferencesModel);
