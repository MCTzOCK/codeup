/**
 * apps/web/src/server/socket/channels/EditorProjectPageCreate.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.01.2023
 *
 */

import { Socket } from "socket.io";
import Channel from "./Channel";
import SocketRegistry from "../SocketRegistry";
import EditorProjectPageModel from "@codeup/util/src/models/EditorProjectPageModel";
import EditorProjectModel from "@codeup/util/src/models/EditorProjectModel";

export default class EditorProjectPageCreateChannel extends Channel {
  constructor(socket: Socket, channelName: string) {
    super(socket, channelName);
  }

  public register() {
    this.socket.on(this.channelName, async (data) => {
      if (SocketRegistry.loggedIn[this.socket.id]) {
        const { id, type, url, content } = data;

        if (url.startsWith("/api")) {
          this.emit({
            error: "URL cannot start with api",
          });
          return;
        }

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
            project.contributors.find(
              (c: any) =>
                c.user.equals(SocketRegistry.loggedIn[this.socket.id].id) &&
                c.permissions.includes("WRITE")
            )
          )
        ) {
          this.emit({
            error: "Not authorized",
            success: false,
          });
          return;
        }

        const existingPage = await EditorProjectPageModel.findOne({
          project: project._id,
          url,
        });

        if (existingPage) {
          this.emit({
            error: "Page already exists",
            success: false,
          });
          return;
        }

        const page = await EditorProjectPageModel.create({
          project: id,
          type,
          url,
          mainContent: content
            ? content
            : type.toLowerCase() === "html"
            ? "<h1>HTML Seite</h1>"
            : 'Gib "Hallo Welt" in der Dialogbox aus',
          resources: [],
        });

        this.emit({
          page,
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
