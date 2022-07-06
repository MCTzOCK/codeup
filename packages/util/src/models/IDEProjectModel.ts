/**
 * packages/util/src/models/IDEProjectModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.07.2022
 *
 */

import mongoose from "mongoose";

const IDEProject = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  contributors: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    required: true,
    default: [],
  },
  files: {
    type: [
      {
        path: {
          type: String,
          default: "/new-file.txt",
        },
        content: {
          type: String,
          default: "",
        },
      },
    ],
    required: true,
    default: [{}],
  },
});

export default mongoose.models?.IDEProject ||
  mongoose.model("IDEProject", IDEProject);
