/**
 * packages/util/src/models/ProjectIdeaModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.12.2022
 *
 */

import mongoose from "mongoose";

const ProjectIdea = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  exampleDeployedURL: {
    type: String,
    required: false,
  },
  exampleSourceURL: {
    type: String,
    required: false,
  },
  level: {
    type: String,
    required: true,
  },
});

export default mongoose.models?.ProjectIdea ||
  mongoose.model("ProjectIdea", ProjectIdea);
