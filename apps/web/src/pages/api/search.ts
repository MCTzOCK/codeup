/**
 * apps/web/src/pages/api/search.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.12.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../global/server/isLoggedIn";
import UserModel from "@codeup/util/dist/models/UserModel";
import ForumPostModel from "@codeup/util/dist/models/ForumPostModel";
import RepositoryModel from "@codeup/util/dist/models/RepositoryModel";
import CourseModel from "@codeup/util/dist/models/CourseModel";
import Certificate from "@codeup/util/dist/models/Certificate";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { auth, user } = await isLoggedIn(req, res);

    const { query, model, page } = req.query as {
      query: string;
      model: string;
      page: string;
    };

    const allowedModels = ["user", "post", "repository", "course"];

    if (!allowedModels.includes(model)) {
      return res.status(400).json({
        status: 400,
        error: "Model not allowed",
      });
    }

    let maxPage = 0;
    let data = [];

    switch (model.toLowerCase()) {
      case "user":
        const users = await UserModel.find({
          username: { $regex: query, $options: "i" },
          firstName: { $regex: query, $options: "i" },
          lastName: { $regex: query, $options: "i" },
        })
          .limit(10)
          .skip(parseInt(page) * 10);

        data = users.map((user) => ({
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          _id: user._id,
        }));

        maxPage = await UserModel.countDocuments({
          username: { $regex: query, $options: "i" },
          firstName: { $regex: query, $options: "i" },
          lastName: { $regex: query, $options: "i" },
        });
        break;
      case "post":
        const posts = await ForumPostModel.find({
          content: { $regex: query, $options: "i" },
          username: { $regex: query, $options: "i" },
        })
          .limit(10)
          .skip(parseInt(page) * 10);

        data = posts;

        maxPage = await ForumPostModel.countDocuments({
          content: { $regex: query, $options: "i" },
          username: { $regex: query, $options: "i" },
        });

        break;
      case "repository":
        const userRepos = await RepositoryModel.find({
          username: user.username,
          name: { $regex: query, $options: "i" },
        });

        const publicRepos = await RepositoryModel.find({
          public: true,
          name: { $regex: query, $options: "i" },
        });

        const response = [...userRepos, ...publicRepos];

        data = response.slice(parseInt(page) * 10, 10);

        maxPage = response.length;

        break;
      case "course":
        const courses = await CourseModel.find({
          name: { $regex: query, $options: "i" },
          available: "public",
        })
          .limit(10)
          .skip(parseInt(page) * 10);

        data = courses;

        maxPage = await CourseModel.countDocuments({
          name: { $regex: query, $options: "i" },
          available: "public",
        });

        break;
      default:
        break;
    }

    if (data.length === 0) {
      return res.status(404).json({
        status: 404,
        error: "No data found",
      });
    }

    res.status(200).json({
      status: 200,
      data,
      maxPage: Math.ceil(maxPage / 10) > 0 ? Math.ceil(maxPage / 10) - 1 : 0,
    });
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
