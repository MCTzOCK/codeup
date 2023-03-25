/**
 * apps/web/src/server/socket/channels/EditorProjectChangeSetting.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.01.2023
 *
 */

import { Socket } from "socket.io";
import Channel from "./Channel";
import SocketRegistry from "../SocketRegistry";
import EditorProjectModel from "@codeup/util/dist/models/EditorProjectModel";

export default class EditorProjectChangeSettingChannel extends Channel {
  constructor(socket: Socket, channelName: string) {
    super(socket, channelName);
  }

  public register() {
    this.socket.on(this.channelName, async (data) => {
      try {
        if (SocketRegistry.loggedIn[this.socket.id]) {
          const { id, update } = data;

          const project = await EditorProjectModel.findOne({
            _id: id,
          });

          if (project) {
            if (
              project.owner.equals(SocketRegistry.loggedIn[this.socket.id].id)
            ) {
              const allowedKeys = [
                "customDomain",
                "name",
                "discovery",
                "discoveryDescription",
              ];

              for (const key of Object.keys(update)) {
                if (
                  key === "discovery" &&
                  project.customDomain.startsWith("disabled:")
                )
                  continue;
                if (allowedKeys.includes(key)) {
                  project[key] = update[key];
                }
                if (
                  key === "customDomain" &&
                  update[key].startsWith("disabled:")
                ) {
                  project.discovery = false;
                }
              }

              project.updated_at = new Date();

              await project.save();

              this.emit({
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
      } catch (e) {
        this.emit({
          success: false,
          // @ts-ignore
          error: e.message,
        });
      }
    });
  }

  public emit(data: any) {
    this.socket.emit(this.channelName, data);
  }
}
