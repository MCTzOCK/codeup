/**
 * apps/web/src/server/socket/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.01.2023
 *
 */
import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import AuthenticateChannel from "./channels/Authenticate";
import EditorProjectListChannel from "./channels/EditorProjectList";
import SocketRegistry from "./SocketRegistry";
import EditorProjectCreateChannel from "./channels/EditorProjectCreate";
import EditorProjectDeleteChannel from "./channels/EditorProjectDelete";

export function createSocketServer(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    const authenticateChannel = new AuthenticateChannel(socket, "authenticate");

    const editorProjectListChannel = new EditorProjectListChannel(
      socket,
      "editor:projects:list"
    );

    const editorProjectCreateChannel = new EditorProjectCreateChannel(
      socket,
      "editor:projects:create"
    );

    const editorProjectDeleteChannel = new EditorProjectDeleteChannel(
      socket,
      "editor:projects:delete"
    );

    authenticateChannel.register();

    editorProjectListChannel.register();
    editorProjectCreateChannel.register();
    editorProjectDeleteChannel.register();

    socket.on("disconnect", () => {
      delete SocketRegistry.loggedIn[socket.id];
    });
  });
}
