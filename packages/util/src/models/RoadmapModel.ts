/**
 * packages/util/src/models/RoadmapModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.04.2023
 *
 */

import mongoose from "mongoose";

const Roadmap = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  projectIdea: {
    type: String,
    ref: "ProjectIdea",
  },
  linkedCourses: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Course",
  },
  linkedTodos: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Todo",
  },
  linkedFlows: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Flow",
  },
  linkedProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
});

export default mongoose.models?.Roadmap || mongoose.model("Roadmap", Roadmap);
