/**
 * packages/util/src/models/OrgProjectTemplateModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.03.2023
 *
 */
import mongoose from "mongoose";

const OrgTemplateModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  org: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Org",
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EditorProject",
    required: true,
  },
});

export default mongoose.models?.OrgTemplate ||
  mongoose.model("OrgTemplate", OrgTemplateModel);
