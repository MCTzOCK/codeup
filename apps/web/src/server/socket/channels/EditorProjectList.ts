/**
 * apps/web/src/server/socket/channels/EditorProjectDataChannel.ts
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

export default class EditorProjectListChannel extends Channel {
  constructor(socket: Socket, channelName: string) {
    super(socket, channelName);
  }

  public register() {
    this.socket.on(this.channelName, async (data) => {
      if (SocketRegistry.loggedIn[this.socket.id]) {
        let projects: any[] = [
          ...(await EditorProjectModel.find({
            owner: SocketRegistry.loggedIn[this.socket.id].id,
          })),
          ...(await EditorProjectModel.find({
            contributors: {
              $elemMatch: {
                user: SocketRegistry.loggedIn[this.socket.id].id,
              },
            },
          })),
        ];

        this.emit({
          projects,
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
