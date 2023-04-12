/**
 * packages/util/src/models/CustomerChoiceModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 12.04.2023
 *
 */

import mongoose from "mongoose";

const CustomerChoice = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

export default mongoose.models?.CustomerChoice ||
  mongoose.model("CustomerChoice", CustomerChoice);
