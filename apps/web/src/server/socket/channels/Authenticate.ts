/**
 * apps/web/src/server/socket/channels/Authenticate.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.01.2023
 *
 */
import { Socket } from "socket.io";
import Channel from "./Channel";
import UserModel from "@codeup/util/dist/models/UserModel";
import { decode, verify } from "jsonwebtoken";
import SocketRegistry from "../SocketRegistry";

export default class AuthenticateChannel extends Channel {
  constructor(socket: Socket, channelName: string) {
    super(socket, channelName);
  }

  public register() {
    this.socket.on(this.channelName, async (token: string) => {
      if (SocketRegistry.loggedIn[this.socket.id]) {
        this.emit({
          authenticated: true,
        });
        return;
      }

      if (verify(token, process.env.JWT_SECRET as string)) {
        const decoded = decode(token) as any;

        const user = await UserModel.findOne({ username: decoded.username });

        if (user) {
          SocketRegistry.loggedIn[this.socket.id] = {
            id: user._id,
            username: user.username,
            admin: user.role === "admin" ? true : undefined,
          };
          this.emit({
            authenticated: true,
          });
        } else {
          this.emit({
            authenticated: false,
          });
        }
      } else {
        this.emit({
          error: "Invalid Token",
          authenticated: false,
        });
      }
    });
  }

  public emit(data: any) {
    this.socket.emit(this.channelName, data);
  }
}
