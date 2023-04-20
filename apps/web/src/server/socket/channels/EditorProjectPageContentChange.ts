/**
 * apps/web/src/server/socket/channels/EditorProjectPageContentChange.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.01.23
 *
 */
import { Socket } from "socket.io";
import Channel from "./Channel";
import SocketRegistry from "../SocketRegistry";
import EditorProjectPageModel from "@codeup/util/src/models/EditorProjectPageModel";
import EditorProjectModel from "@codeup/util/src/models/EditorProjectModel";

export default class EditorProjectPageContentChangeChannel extends Channel {
  constructor(socket: Socket, channelName: string) {
    super(socket, channelName);
  }

  public register() {
    this.socket.on(this.channelName, async (data) => {
      try {
        if (SocketRegistry.loggedIn[this.socket.id]) {
          const { projectId, pageId, content, resource, resourceType } = data;

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
              project.contributors.find(
                (c: any) =>
                  c.user.equals(SocketRegistry.loggedIn[this.socket.id].id) &&
                  c.permissions.includes("WRITE")
              ) ||
              SocketRegistry.loggedIn[this.socket.id].admin
            )
          ) {
            this.emit({
              error: "Not authorized",
              success: false,
            });
            return;
          }

          const page = await EditorProjectPageModel.findOne({
            project: project._id,
            _id: pageId,
          });

          if (!page) {
            this.emit({
              error: "Page does not exists",
              success: false,
            });
            return;
          }

          if (resource === "codeup.main_resource") {
            page.mainContent = content;
          } else {
            const resourceObject = page.resources.find(
              (r: any) => r.name === resource
            );

            if (!resourceObject) {
              if (resourceType) {
                page.resources.push({
                  name: resource,
                  type: resourceType,
                  content: content,
                });
              } else {
                this.emit({
                  error: "Resource not found",
                  success: false,
                });
                return;
              }
            } else {
              page.resources = page.resources
                .map((r: any) => {
                  if (r.name !== resource) {
                    return r;
                  } else {
                    if (content === "codeup.delete_resource") {
                      return undefined;
                    }
                    return {
                      content: content,
                      name: r.name,
                      type: r.type,
                    };
                  }
                })
                .filter((r: any) => r !== null && r !== undefined);
            }
          }

          SocketRegistry.loggedIn[this.socket.id].currentlyEditing = pageId;

          let otherSockets = Object.keys(SocketRegistry.loggedIn).filter(
            (s) => {
              if (!SocketRegistry.loggedIn[s]) return false;
              if (s === this.socket.id) return false;
              if (!SocketRegistry.loggedIn[s].currentlyEditing) return false;
              if (SocketRegistry.loggedIn[s].currentlyEditing !== pageId)
                return false;

              return true;
            }
          );

          let realOtherSockets = otherSockets.map((s) => {
            // @ts-ignore
            return global.io.sockets.sockets.get(s);
          });

          for (const s of realOtherSockets) {
            if (!s) console.log("Socket not found");
            s.emit("editor:projects:page:content", {
              success: true,
              user: SocketRegistry.loggedIn[this.socket.id].username,
              page: {
                url: page.url,
                mainContent: page.mainContent,
                type: page.type,
                resources: page.resources,
              },
            });
          }

          await page.save();

          this.emit({
            success: true,
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
