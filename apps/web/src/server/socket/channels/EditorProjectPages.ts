/**
 * apps/web/src/server/socket/channels/EditorProjectPages.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.01.2023
 *
 */
import { Socket } from "socket.io";
import SocketRegistry from "../SocketRegistry";
import EditorProjectModel from "@codeup/util/src/models/EditorProjectPageModel";
import Channel from "./Channel";
import EditorProjectPageModel from "@codeup/util/src/models/EditorProjectPageModel";

export default class EditorProjectPagesChannel extends Channel {
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
            const pages = await EditorProjectPageModel.find({
              project: project._id,
            });

            this.emit({
              pages,
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
