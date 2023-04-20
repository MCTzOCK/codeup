/**
 * apps/web/src/server/socket/channels/EditorProjectContributorChannel.ts
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

export default class EditorProjectContributorChannel extends Channel {
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
            project.owner.equals(SocketRegistry.loggedIn[this.socket.id].id) ||
            project.contributors.find(
              (c: any) =>
                c.user.equals(SocketRegistry.loggedIn[this.socket.id].id) &&
                c.permissions.includes("MANAGE-CONTRIBUTORS")
            ) ||
            SocketRegistry.loggedIn[this.socket.id].admin
          ) {
            let c: {
              email: string;
              id: string;
              permissions: string[];
              username: string;
              firstName: string;
              lastName: string;
            }[] = [];
            let owner: {
              email: string;
              id: string;
              permissions: string[];
              username: string;
              firstName: string;
              lastName: string;
            };

            for (const contributor of project.contributors) {
              const contributor0 = await UserModel.findById(contributor.user);
              c = [
                ...c,
                {
                  email: contributor0.email,
                  id: contributor.user,
                  permissions: contributor.permissions,
                  username: contributor0.username,
                  firstName: contributor0.firstName,
                  lastName: contributor0.lastName,
                },
              ];
            }

            const owner0 = await UserModel.findById(project.owner);
            owner = {
              email: owner0.email,
              id: owner0._id,
              permissions: ["OWNER"],
              username: owner0.username,
              firstName: owner0.firstName,
              lastName: owner0.lastName,
            };

            this.emit({
              success: true,
              contributors: c,
              owner,
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
