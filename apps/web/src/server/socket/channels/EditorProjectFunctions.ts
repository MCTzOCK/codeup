/**
 * apps/web/src/server/socket/channels/EditorProjectFunctions.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.02.2023
 *
 */
import Channel from "./Channel";
import { Socket } from "socket.io";
import SocketRegistry from "../SocketRegistry";
import EditorProjectModel from "@codeup/util/src/models/EditorProjectModel";
import EditorProjectPageModel from "@codeup/util/src/models/EditorProjectPageModel";
import EditorProjectFunctionModel from "@codeup/util/dist/models/EditorProjectFunctionModel";

export default class EditorProjectFunctionsChannel extends Channel {
  constructor(socket: Socket, channelName: string) {
    super(socket, channelName);
  }

  public register() {
    this.socket.on(this.channelName, async (data) => {
      if (SocketRegistry.loggedIn[this.socket.id]) {
        const { id } = data;

        const project = await EditorProjectModel.findOne({
          _id: id,
        });

        if (project) {
          if (
            project.owner.equals(SocketRegistry.loggedIn[this.socket.id].id)
          ) {
            const functions = await EditorProjectFunctionModel.find({
              project: project._id,
            });

            let functionsArr = [];

            for (const func of functions) {
              functionsArr.push({
                _id: func._id,
                path: func.path,
                code: func.code,
              });
            }

            this.emit({
              functions: functionsArr,
              success: true,
            });
          } else {
            this.emit({
              error: "Not authorized",
              success: false,
            });
          }
        } else {
          this.emit({
            error: "Project not found",
            success: false,
          });
        }
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
