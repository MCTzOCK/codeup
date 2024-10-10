/**
 * packages/util/src/models/ContactModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.11.2022
 *
 */

import mongoose from "mongoose";

const Contact = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
    required: true,
    index: true,
  },
  category: {
    type: String,
    required: true,
    default: "sonstiges",
  },
  title: {
    type: String,
    required: true,
  },
});

export default mongoose.models?.Contact || mongoose.model("Contact", Contact);
