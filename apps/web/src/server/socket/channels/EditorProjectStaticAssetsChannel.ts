/**
 * apps/web/src/server/socket/channels/EditorProjectStaticAssetsChannel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 28.01.23
 *
 */
import { Socket } from "socket.io";
import Channel from "./Channel";
import SocketRegistry from "../SocketRegistry";
import EditorProjectModel from "@codeup/util/dist/models/EditorProjectModel";
import mongoose, { mongo } from "mongoose";

export default class EditorProjectStaticAssetsChannel extends Channel {
  constructor(socket: Socket, channelName: string) {
    super(socket, channelName);
  }

  public register() {
    this.socket.on(this.channelName, async (data) => {
      try {
        if (SocketRegistry.loggedIn[this.socket.id]) {
          const { id } = data;

          const project = await EditorProjectModel.findOne({
            _id: id,
          });

          if (project) {
            if (
              project.owner.equals(SocketRegistry.loggedIn[this.socket.id].id)
            ) {
              const bucket = new mongoose.mongo.GridFSBucket(
                mongoose.connection.db,
                {
                  bucketName: "editor-static-assets",
                }
              );

              const files = await mongoose.connection.db
                .collection("editorStaticAssets.files")
                .find({
                  metadata: {
                    projectId: id,
                  },
                })
                .toArray();

              this.emit({
                success: true,
                files: files,
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
