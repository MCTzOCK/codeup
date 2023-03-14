/**
 * packages/util/src/models/OrgDashboard.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.03.2023
 *
 */

import mongoose from "mongoose";

const OrgDashboardModel = new mongoose.Schema({
  org: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Org",
    required: true,
  },
});

export default mongoose.models?.OrgDashboard ||
  mongoose.model("OrgDashboard", OrgDashboardModel);
