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
import EditorProjectRenameChannel from "./channels/EditorProjectRename";
import EditorProjectContributorChannel from "./channels/EditorProjectContributorChannel";
import EditorProjectContributorAddChannel from "./channels/EditorProjectContributorAddChannel";
import EditorProjectContributorDeleteChannel from "./channels/EditorProjectContributorDeleteChannel";
import EditorProjectContributorPermissionChannel from "./channels/EditorProjectContributorPermissionChannel";

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

    const editorProjectRenameChannel = new EditorProjectRenameChannel(
      socket,
      "editor:projects:rename"
    );

    const editorProjectContributorChannel = new EditorProjectContributorChannel(
      socket,
      "editor:projects:contributors"
    );

    const editorProjectContributorAddChannel =
      new EditorProjectContributorAddChannel(
        socket,
        "editor:projects:contributors:add"
      );

    const editorProjectContributorDeleteChannel =
      new EditorProjectContributorDeleteChannel(
        socket,
        "editor:projects:contributors:delete"
      );

    const editorProjectContributorPermissionChannel =
      new EditorProjectContributorPermissionChannel(
        socket,
        "editor:projects:contributors:permission"
      );

    authenticateChannel.register();

    editorProjectListChannel.register();
    editorProjectCreateChannel.register();
    editorProjectDeleteChannel.register();
    editorProjectRenameChannel.register();
    editorProjectContributorChannel.register();
    editorProjectContributorAddChannel.register();
    editorProjectContributorDeleteChannel.register();
    editorProjectContributorPermissionChannel.register();

    socket.on("disconnect", () => {
      delete SocketRegistry.loggedIn[socket.id];
    });
  });
}
