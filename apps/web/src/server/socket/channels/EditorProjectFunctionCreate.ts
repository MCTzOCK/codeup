/**
 * apps/web/src/server/socket/channels/EditorProjectFunctionCreate.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.02.2023
 *
 */

import { Socket } from "socket.io";
import Channel from "./Channel";
import SocketRegistry from "../SocketRegistry";
import EditorProjectPageModel from "@codeup/util/src/models/EditorProjectPageModel";
import EditorProjectModel from "@codeup/util/src/models/EditorProjectModel";
import EditorProjectFunctionModel from "@codeup/util/dist/models/EditorProjectFunctionModel";

export default class EditorProjectFunctionCreateChannel extends Channel {
  constructor(socket: Socket, channelName: string) {
    super(socket, channelName);
  }

  public register() {
    this.socket.on(this.channelName, async (data) => {
      if (SocketRegistry.loggedIn[this.socket.id]) {
        const { id, url } = data;

        const project = await EditorProjectModel.findOne({
          _id: id,
        });

        if (!project) {
          this.emit({
            error: "Project not found",
            success: false,
          });
          return;
        }

        if (
          !(
            project.owner.equals(SocketRegistry.loggedIn[this.socket.id].id) ||
            project.contributors.includes(
              SocketRegistry.loggedIn[this.socket.id].id
            )
          )
        ) {
          this.emit({
            error: "Not authorized",
            success: false,
          });
          return;
        }

        const existingFunction = await EditorProjectFunctionModel.findOne({
          project: project._id,
          path: url,
        });

        if (existingFunction) {
          this.emit({
            error: "Function already exists",
            success: false,
          });
          return;
        }

        const func = await EditorProjectFunctionModel.create({
          project: id,
          path: "/api" + url,
          code: "res.status(200).json({ message: \"Hello World!\"});",
        });

        this.emit({
          function: func,
          success: true,
        });
      } else {
        this.emit({
          error: "Not authenticated",
          success: false,
        });
      }
    });
  }

  public emit(data: any) {
    this.socket.emit(this.channelName, data);
  }
}
