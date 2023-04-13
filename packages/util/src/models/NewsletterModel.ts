/**
 * packages/util/src/models/NewsletterModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.04.2023
 *
 */
import mongoose from "mongoose";

const Newsletter = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

export default mongoose.models?.Newsletter ||
  mongoose.model("Newsletter", Newsletter);
