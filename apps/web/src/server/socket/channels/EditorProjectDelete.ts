/**
 * apps/web/src/server/socket/channels/EditorProjectDelete.ts
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
import EditorProjectPageModel from "@codeup/util/dist/models/EditorProjectPageModel";
import EditorProjectFunctionModel from "@codeup/util/dist/models/EditorProjectFunctionModel";
import OrgProjectTemplateModel from "@codeup/util/dist/models/OrgProjectTemplateModel";

export default class EditorProjectDeleteChannel extends Channel {
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

            for (const page of pages) {
              await page.remove();
            }

            const functions = await EditorProjectFunctionModel.find({
              project: project._id,
            });

            for (const func of functions) {
              await func.remove();
            }

            const templates = await OrgProjectTemplateModel.find({
              project: project._id,
            });

            for (const template of templates) {
              await template.remove();
            }

            await project.remove();
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
    });
  }

  public emit(data: any) {
    this.socket.emit(this.channelName, data);
  }
}
