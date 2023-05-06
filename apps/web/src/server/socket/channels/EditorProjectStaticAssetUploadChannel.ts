/**
 * apps/web/src/server/socket/channels/EditorProjectStaticAssetUploadChannel.ts
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
import mongoose from "mongoose";
import { v4 } from "uuid";

export default class EditorProjectStaticAssetUploadChannel extends Channel {
  constructor(socket: Socket, channelName: string) {
    super(socket, channelName);
  }

  public register() {
    this.socket.on(
      this.channelName,
      async (data: any, callback: (status: any) => void) => {
        if (SocketRegistry.loggedIn[this.socket.id]) {
          let { id, fileContent, fileName } = data;

          fileName = fileName.replace(/[^a-z0-9.]/gi, '_').toLowerCase();

          const project = await EditorProjectModel.findOne({
            _id: id,
          });

          if (project) {
            if (
              project.owner.equals(
                SocketRegistry.loggedIn[this.socket.id].id
              ) ||
              SocketRegistry.loggedIn[this.socket.id].admin
            ) {
              const bucket = new mongoose.mongo.GridFSBucket(
                mongoose.connection.db,
                {
                  bucketName: "editorStaticAssets",
                }
              );

              const uploadStream = bucket.openUploadStream(
                `${project._id.toString()}/${fileName}`,
                {
                  metadata: {
                    projectId: id,
                  },
                }
              );

              uploadStream.write(fileContent, async () => {
                uploadStream.end();

                project.updated_at = new Date();
                await project.save();

                this.emit({
                  success: true,
                  fileUrl:
                    "/editor-static-assets/" +
                    `${project._id.toString()}/${fileName}`,
                });
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
      }
    );
  }

  public emit(data: any) {
    this.socket.emit(this.channelName, data);
  }
}
