/**
 * src/util/models/AskProfileModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.06.2023
 *
 */

import mongoose from "mongoose";

const AskProfileModel = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  banner: {
    type: String,
    required: true,
    default: "/_static/images/software-developer-6521720_1920.jpg",
  },
  website: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  badges: {
    type: [String],
    required: false,
  },
  certificates: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Certificate",
    required: false,
  },
  projects: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Project",
    required: false,
  },
});

export default mongoose.models?.AskProfile ||
  mongoose.model("AskProfile", AskProfileModel);
