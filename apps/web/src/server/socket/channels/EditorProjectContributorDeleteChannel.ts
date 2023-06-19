/**
 * apps/web/src/server/socket/channels/EditorProjectContributorDeleteChannel.ts
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
import EditorProjectModel from "@codeup/util/dist/models/EditorProjectModel";
import UserModel from "@codeup/util/dist/models/UserModel";

export default class EditorProjectContributorDeleteChannel extends Channel {
  constructor(socket: Socket, channelName: string) {
    super(socket, channelName);
  }

  public register() {
    this.socket.on(this.channelName, async (data) => {
      if (SocketRegistry.loggedIn[this.socket.id]) {
        const { id, email } = data;

        const project = await EditorProjectModel.findOne({
          _id: id,
        });

        if (project) {
          if (
            project.owner.equals(SocketRegistry.loggedIn[this.socket.id].id) ||
            project.contributors.find(
              (c: any) =>
                c.user.equals(SocketRegistry.loggedIn[this.socket.id].id) &&
                c.permissions.includes("MANAGE-CONTRIBUTORS")
            ) ||
            SocketRegistry.loggedIn[this.socket.id].admin
          ) {
            if (!SocketRegistry.loggedIn[this.socket.id].pro) {
              this.emit({
                error:
                  "Du musst CodeUp PRO abonnieren, um mit anderen zusammenarbeiten zu können.",
                success: false,
              });
              return;
            }
            const contributor = await UserModel.findOne({
              email,
            });

            if (contributor) {
              if (
                project.contributors.find((c: any) =>
                  c.user.equals(contributor._id)
                ) ||
                project.owner.equals(contributor._id)
              ) {
                project.contributors = project.contributors.filter(
                  (c: any) => !c.user.equals(contributor._id)
                );

                await project.save();

                this.emit({
                  success: true,
                });
              } else {
                this.emit({
                  error: "Contributor does not exists",
                });
                return;
              }
            } else {
              this.emit({
                error: "User not found",
                success: false,
              });
            }
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
