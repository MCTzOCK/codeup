/**
 * apps/web/src/server/socket/channels/EditorProjectFunctionContent.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.02.23
 *
 */
import { Socket } from "socket.io";
import Channel from "./Channel";
import SocketRegistry from "../SocketRegistry";
import EditorProjectPageModel from "@codeup/util/src/models/EditorProjectPageModel";
import EditorProjectModel from "@codeup/util/src/models/EditorProjectModel";
import EditorProjectFunctionModel from "@codeup/util/dist/models/EditorProjectFunctionModel";

export default class EditorProjectFunctionContentChannel extends Channel {
  constructor(socket: Socket, channelName: string) {
    super(socket, channelName);
  }

  public register() {
    this.socket.on(this.channelName, async (data) => {
      try {
        if (SocketRegistry.loggedIn[this.socket.id]) {
          const { projectId, pageId } = data;

          const project = await EditorProjectModel.findOne({
            _id: projectId,
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
              project.owner.equals(
                SocketRegistry.loggedIn[this.socket.id].id
              ) ||
              project.contributors.find((c: any) =>
                c.user.equals(SocketRegistry.loggedIn[this.socket.id].id)
              )
            )
          ) {
            this.emit({
              error: "Not authorized",
              success: false,
            });
            return;
          }

          const func = await EditorProjectFunctionModel.findOne({
            project: project._id,
            _id: pageId,
          });

          if (!func) {
            this.emit({
              error: "Function does not exists",
              success: false,
            });
            return;
          }

          this.emit({
            success: true,
            function: {
              path: func.path,
              code: func.code,
            },
          });
        } else {
          this.emit({
            error: "Not authenticated",
            success: false,
          });
        }
      } catch (e) {
        this.emit({
          // @ts-ignore
          error: e.message,
          success: false,
        });
      }
    });
  }

  public emit(data: any) {
    this.socket.emit(this.channelName, data);
  }
}
