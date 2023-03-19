/**
 * packages/util/src/models/OrgBlogModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.03.2023
 *
 */
import mongoose from "mongoose";

const OrgBlogModel = new mongoose.Schema({
  org: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Org",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

export default mongoose.models?.OrgBlog ||
  mongoose.model("OrgBlog", OrgBlogModel);
