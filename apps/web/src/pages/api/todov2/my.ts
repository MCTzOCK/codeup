/**
 * apps/web/src/pages/api/todov2/my.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.07.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../../global/server/isLoggedIn";
import ToDoListV2Model from "@codeup/util/dist/models/ToDoListV2Model";
import ToDoListV2ItemModel from "@codeup/util/dist/models/ToDoListV2ItemModel";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { auth, user } = await isLoggedIn(req, res);
    if (!auth) return;

    if (req.method === "GET") {
      if (req.query.id) {
        const list = await ToDoListV2Model.findById(req.query.id);
        if (!list) {
          res.status(404).json({
            status: 404,
            error: "Not Found: list not found",
          });
          return;
        }

        if (list.owner.toString() !== user._id.toString()) {
          res.status(403).json({
            status: 403,
            error: "Forbidden: you are not the owner of this list",
          });
          return;
        }

        const items = await ToDoListV2ItemModel.find({ list: list._id });

        res.status(200).json({
          list: {
            ...list,
            items,
          },
        });

        return;
      }
      const lists = await ToDoListV2Model.find({ owner: user._id });

      let returnLists: any[] = [];

      for await (const l of lists) {
        returnLists.push({
          ...l._doc,
          items: await ToDoListV2ItemModel.find({ list: l._id }),
        });
      }

      res.status(200).json({
        lists: returnLists,
      });
    } else if (req.method === "POST") {
      const { name } = req.body;

      if (!name) {
        res.status(400).json({
          status: 400,
          error: "Bad Request: missing name parameter",
        });
        return;
      }

      const list = await ToDoListV2Model.create({
        owner: user._id,
        name,
      });

      res.status(200).json({
        list,
      });
    } else if (req.method === "DELETE") {
      const { id } = req.query;

      if (!id) {
        res.status(400).json({
          status: 400,
          error: "Bad Request: missing id parameter",
        });
        return;
      }

      const list = await ToDoListV2Model.findById(id);

      if (!list) {
        res.status(404).json({
          status: 404,
          error: "Not Found: list not found",
        });
        return;
      }

      if (list.owner.toString() !== user._id.toString()) {
        res.status(403).json({
          status: 403,
          error: "Forbidden: you are not the owner of this list",
        });
        return;
      }

      await ToDoListV2ItemModel.deleteMany({ list: list._id });

      await list.deleteOne();

      res.status(200).json({
        status: 200,
        message: "List deleted",
      });
    } else if (req.method === "PUT") {
      const { id, name } = req.body;

      if (!id || !name) {
        res.status(400).json({
          status: 400,
          error: "Bad Request: missing id or name parameter",
        });
        return;
      }

      const list = await ToDoListV2Model.findById(id);

      if (!list) {
        res.status(404).json({
          status: 404,
          error: "Not Found: list not found",
        });
        return;
      }

      if (list.owner.toString() !== user._id.toString()) {
        res.status(403).json({
          status: 403,
          error: "Forbidden: you are not the owner of this list",
        });
        return;
      }

      list.name = name;

      await list.save();

      res.status(200).json({
        list,
      });
    }
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
