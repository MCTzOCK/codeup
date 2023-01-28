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
import EditorProjectPagesChannel from "./channels/EditorProjectPages";
import EditorProjectPageCreateChannel from "./channels/EditorProjectPageCreate";
import EditorProjectPageDeleteChannel from "./channels/EditorProjectPageDelete";
import EditorProjectPageRenameChannel from "./channels/EditorProjectPageRename";
import EditorProjectPageContentChannel from "./channels/EditorProjectPageContent";
import EditorProjectPageContentChangeChannel from "./channels/EditorProjectPageContentChange";
import EditorProjectInfoChannel from "./channels/EditorProjectInfo";
import EditorProjectChangeSettingChannel from "./channels/EditorProjectChangeSetting";
import EditorProjectStaticAssetUploadChannel from "./channels/EditorProjectStaticAssetUploadChannel";
import EditorProjectStaticAssetsChannel from "./channels/EditorProjectStaticAssetsChannel";
import EditorProjectStaticAssetDeleteChannel from "./channels/EditorProjectStaticAssetDeleteChannel";

export function createSocketServer(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    maxHttpBufferSize: 1e8,
  });

  io.on("connection", (socket: Socket) => {
    // system channels

    const authenticateChannel = new AuthenticateChannel(socket, "authenticate");

    // system channels end

    // editor project

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
    const editorProjectInfoChannel = new EditorProjectInfoChannel(
      socket,
      "editor:projects:info"
    );

    // editor project end

    // editor project contributors

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

    // editor project contributors end

    // editor pages

    const editorProjectPagesChannel = new EditorProjectPagesChannel(
      socket,
      "editor:projects:pages"
    );
    const editorProjectPageCreateChannel = new EditorProjectPageCreateChannel(
      socket,
      "editor:projects:pages:create"
    );
    const editorProjectPageDeleteChannel = new EditorProjectPageDeleteChannel(
      socket,
      "editor:projects:pages:delete"
    );
    const editorProjectPageRenameChannel = new EditorProjectPageRenameChannel(
      socket,
      "editor:projects:pages:rename"
    );
    const editorProjectPageContentChannel = new EditorProjectPageContentChannel(
      socket,
      "editor:projects:page:content"
    );
    const editorProjectPageContentChangeChannel =
      new EditorProjectPageContentChangeChannel(
        socket,
        "editor:projects:page:content:set"
      );

    // editor pages end

    // project settings

    const editorProjectChangeSettingChannel =
      new EditorProjectChangeSettingChannel(socket, "editor:projects:settings");

    // project settings end

    // static assets

    const editorProjectStaticAssetsUploadChannel =
      new EditorProjectStaticAssetUploadChannel(
        socket,
        "editor:projects:static:assets:upload"
      );

    const editorProjectStaticAssetsChannel =
      new EditorProjectStaticAssetsChannel(
        socket,
        "editor:projects:static:assets"
      );

    const editorProjectStaticAssetsDeleteChannel =
      new EditorProjectStaticAssetDeleteChannel(
        socket,
        "editor:projects:static:assets:delete"
      );

    // static assets end

    authenticateChannel.register();

    editorProjectListChannel.register();
    editorProjectCreateChannel.register();
    editorProjectDeleteChannel.register();
    editorProjectRenameChannel.register();
    editorProjectInfoChannel.register();
    editorProjectContributorChannel.register();
    editorProjectContributorAddChannel.register();
    editorProjectContributorDeleteChannel.register();
    editorProjectContributorPermissionChannel.register();
    editorProjectPagesChannel.register();
    editorProjectPageCreateChannel.register();
    editorProjectPageDeleteChannel.register();
    editorProjectPageRenameChannel.register();
    editorProjectPageContentChannel.register();
    editorProjectPageContentChangeChannel.register();
    editorProjectChangeSettingChannel.register();
    editorProjectStaticAssetsUploadChannel.register();
    editorProjectStaticAssetsChannel.register();
    editorProjectStaticAssetsDeleteChannel.register();

    socket.on("disconnect", () => {
      delete SocketRegistry.loggedIn[socket.id];
    });
  });
}
