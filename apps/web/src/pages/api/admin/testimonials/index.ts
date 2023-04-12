/**
 * apps/web/src/pages/api/admin/testimonials/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 12.04.2023
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/dist/mongo";
import jwt from "jsonwebtoken";
import UserModel from "@codeup/util/dist/models/UserModel";
import CustomerChoiceModel from "@codeup/util/dist/models/CustomerChoiceModel";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await mongoConnect();

    const token = req.headers["x-jwt"] as string;

    if (!token) {
      res.status(401).json({ error: "Not authorized" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (!decoded) {
      res.status(401).json({ error: "Not authorized" });
      return;
    }

    const user = await UserModel.findById((decoded as any).id);

    if (!user || user.role !== "admin") {
      res.status(401).json({ error: "Not authorized" });
      return;
    }

    if (req.method === "GET") {
      const testimonials = await CustomerChoiceModel.find();

      res.status(200).json(testimonials);
      return;
    }

    if (req.method === "POST") {
      if (
        !req.body ||
        !req.body.name ||
        !req.body.position ||
        !req.body.company ||
        !req.body.company ||
        !req.body.image
      ) {
        res.status(400).json({ error: "Missing data" });
        return;
      }

      const testimonial = await CustomerChoiceModel.create({
        name: req.body.name,
        position: req.body.position,
        company: req.body.company,
        content: req.body.content,
        image: req.body.image,
      });

      res.status(200).json(testimonial);
      return;
    }

    if (req.method === "DELETE") {
      if (!req.query || !req.query.id) {
        res.status(400).json({ error: "Missing data" });
        return;
      }

      const testimonial = await CustomerChoiceModel.findById(req.query.id);

      if (!testimonial) {
        res.status(404).json({ error: "Not found" });
        return;
      }

      await testimonial.remove();

      res.status(200).json({ success: true });
      return;
    }

    if (req.method === "PUT") {
      if (!req.query || !req.query.id) {
        res.status(400).json({ error: "Missing data" });
        return;
      }

      if (!req.body || !req.body.update) {
        res.status(400).json({ error: "Missing data" });
        return;
      }

      const testimonial = await CustomerChoiceModel.findById(req.query.id);

      if (!testimonial) {
        res.status(404).json({ error: "Not found" });
        return;
      }

      for (const key in req.body.update) {
        if (key === "_id" || key === "__v") return;
        if (testimonial[key]) {
          testimonial[key] = req.body.update[key];
        }
      }

      await testimonial.save();

      res.status(200).json(testimonial);
      return;
    }

    res.status(404).json({ error: "Not found" });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};
