/**
 * apps/web/src/pages/api/todov2/items.ts
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

    const { id } = req.query;

    if (!id) {
      res.status(400).json({
        status: 400,
        error: "Bad Request: id is required",
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

    if (req.method === "GET") {
      const items = await ToDoListV2ItemModel.find({ list: list._id });

      res.status(200).json({
        items,
      });

      return;
    } else if (req.method === "POST") {
      const { name, description } = req.body;

      if (!name) {
        res.status(400).json({
          status: 400,
          error: "Bad Request: name is required",
        });
        return;
      }

      const newItem = new ToDoListV2ItemModel({
        name,
        description,
        list: list._id,
      });

      await newItem.save();

      res.status(200).json({
        item: newItem,
      });

      return;
    } else if (req.method === "PUT") {
      const { name, description, done } = req.body;

      const item = await ToDoListV2ItemModel.findById(req.query.itemId);

      if (!item) {
        res.status(404).json({
          status: 404,
          error: "Not Found: item not found",
        });
        return;
      }

      if (item.list.toString() !== list._id.toString()) {
        res.status(403).json({
          status: 403,
          error: "Forbidden: item is not in this list",
        });
        return;
      }

      if (name) item.name = name;
      if (description) item.description = description;
      if (done !== undefined && done !== null) item.done = done;

      await item.save();

      res.status(200).json({
        item,
      });
    } else if (req.method === "DELETE") {
      const { itemId } = req.query;

      if (!itemId) {
        res.status(400).json({
          status: 400,
          error: "Bad Request: itemId is required",
        });
        return;
      }

      const item = await ToDoListV2ItemModel.findById(itemId);

      if (!item) {
        res.status(404).json({
          status: 404,
          error: "Not Found: item not found",
        });
        return;
      }

      if (item.list.toString() !== list._id.toString()) {
        res.status(403).json({
          status: 403,
          error: "Forbidden: item is not in this list",
        });
        return;
      }

      await item.deleteOne();

      res.status(200).json({
        status: 200,
      });
    }
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
