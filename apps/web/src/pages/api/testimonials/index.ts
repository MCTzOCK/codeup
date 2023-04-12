/**
 * apps/web/src/pages/api/testimonials/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 12.04.2023
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/dist/mongo";
import CustomerChoiceModel from "@codeup/util/dist/models/CustomerChoiceModel";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await mongoConnect();

    const testimonials = await CustomerChoiceModel.find();

    res.status(200).json(testimonials);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};
