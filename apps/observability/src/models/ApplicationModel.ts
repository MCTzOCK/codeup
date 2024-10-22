/**
 * apps/observability/src/models/ApplicationModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.10.2024
 *
 */

import mongoose from "mongoose";

const ApplicationModel = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: false,
  },
  url: {
    type: String,
    required: true,
  },
});

export default mongoose.models?.Application ||
  mongoose.model("Application", ApplicationModel);
