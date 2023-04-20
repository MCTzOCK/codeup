/**
 * apps/web/src/server/socket/channels/EditorProjectStaticAssetDeleteChannel.ts
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
import { ObjectID } from "bson";

export default class EditorProjectStaticAssetDeleteChannel extends Channel {
  constructor(socket: Socket, channelName: string) {
    super(socket, channelName);
  }

  public register() {
    this.socket.on(this.channelName, async (data: any) => {
      if (SocketRegistry.loggedIn[this.socket.id]) {
        const { projectId, assetName } = data;

        const project = await EditorProjectModel.findOne({
          _id: projectId,
        });

        if (project) {
          if (
            project.owner.equals(SocketRegistry.loggedIn[this.socket.id].id) ||
            SocketRegistry.loggedIn[this.socket.id].admin
          ) {
            const bucket = new mongoose.mongo.GridFSBucket(
              mongoose.connection.db,
              {
                bucketName: "editorStaticAssets",
              }
            );

            const file = await bucket.find({
              filename: `${project._id.toString()}/${assetName}`,
            });

            const fileEntry = await file.next();

            if (file) {
              await bucket.delete(new ObjectID(fileEntry!._id.toString()));

              this.emit({
                success: true,
              });
            } else {
              this.emit({
                error: "File not found",
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
