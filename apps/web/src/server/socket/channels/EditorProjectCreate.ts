/**
 * apps/web/src/server/socket/channels/EditorProjectCreate.ts
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
import { v4 } from "uuid";

export default class EditorProjectCreateChannel extends Channel {
  constructor(socket: Socket, channelName: string) {
    super(socket, channelName);
  }

  public register() {
    this.socket.on(this.channelName, async (data) => {
      if (SocketRegistry.loggedIn[this.socket.id]) {
        const { name } = data;

        const project = await EditorProjectModel.create({
          name,
          owner: SocketRegistry.loggedIn[this.socket.id].id,
          published: false,
          discovery: false,
          customDomain: "disabled:" + v4(),
          discoveryDescription: "",
          created_at: new Date(),
          updated_at: new Date(),
          contributors: [],
        });

        this.emit({
          project,
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
