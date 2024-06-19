/**
 * apps/web/src/pages/api/projects/[id]/mysql/databases.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.06.2024
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import mongoConnect from "@codeup/util/dist/mongo";
import { isLoggedIn } from "../../../../../global/server/isLoggedIn";
import ProjectModel from "@codeup/util/dist/models/ProjectModel";
import mysql from "mysql2/promise";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    await mongoConnect();

    const { auth, user } = await isLoggedIn(req, res);

    const { id } = req.query;

    if (!id) {
      res.status(400).json({
        status: 400,
        error: "Invalid Request",
      });
      return;
    }

    const project = await ProjectModel.findById(id);

    if (!project) {
      res.status(404).json({
        status: 404,
        error: "Project not found",
      });
      return;
    }

    if (!project.users.includes(user._id)) {
      res.status(403).json({
        status: 400,
        error: "You are not allowed to view this project",
      });
      return;
    }

    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      port: parseInt((process.env.MYSQL_PORT as string) || "3306"),
      multipleStatements: false,
    });

    // check user creds

    const [rows] = await connection.execute("SHOW DATABASES;");

    const databases = (rows as any).filter((r: any) => {
      return r.Database.startsWith(id);
    });

    let projectDb;

    if (databases.length === 0) {
      await connection.execute("CREATE DATABASE " + id + ";");
      projectDb = id;
    } else {
      projectDb = databases[0];
    }

    const qrUsers = await connection.execute("SELECT * FROM codeup_sys.users;");

    const users = (qrUsers[0] as any).filter((r: any) => {
      return r.username.startsWith(id);
    });

    if (users.length === 0) {
      const pwd1 = Math.random().toString(36);
      await connection.execute(
        `CREATE USER '${id}'@'%' IDENTIFIED BY '${pwd1}';`
      );
      await connection.execute(
        `GRANT ALL PRIVILEGES ON ${id}.* TO '${id}'@'%';`
      );
      await connection.execute(
        `INSERT INTO codeup_sys.users (username, password) VALUES ('${id}', '${pwd1}');`
      );
    }

    const pwd = await connection.execute(
      `SELECT password FROM codeup_sys.users WHERE username = '${id}';`
    );

    if (req.method === "POST") {
      const sql = req.body.sql;

      const aConnection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: id as string,
        password: (pwd as any)[0][0].password,
        port: parseInt((process.env.MYSQL_PORT as string) || "3306"),
        multipleStatements: false,
        database: id as string,
      });

      const [rows] = await aConnection.execute(sql);

      res.status(200).json({
        status: 200,
        data: rows,
      });

      aConnection.end();
    } else if (req.method === "GET") {
      const { action } = req.query;

      if (action === "database") {
        res.status(200).json({
          status: 200,
          data: projectDb,
        });
      } else if (action === "credentials") {
        res.status(200).json({
          status: 200,
          data: {
            username: id,
            password: (pwd as any)[0][0].password,
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT,
          },
        });
      }
    }

    connection.end();
  } catch (e: any) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
