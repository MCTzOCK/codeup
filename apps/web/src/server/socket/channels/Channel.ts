/**
 * apps/web/src/server/socket/channels/Channel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.01.2023
 *
 */
import { Socket } from "socket.io";

export default abstract class Channel {
  constructor(protected socket: Socket, protected channelName: string) {
    this.socket = socket;
    this.channelName = channelName;
  }

  public abstract register(): void;

  public abstract emit(data: any): void;
}
