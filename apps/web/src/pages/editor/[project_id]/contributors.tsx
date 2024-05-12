/**
 * apps/web/src/pages/editor/[project_id]/contributors.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.01.2023
 *
 */

import * as React from "react";
import EditorProjectLayout from "@codeup/components/editor/EditorProjectLayout";
import CollaboratorManagerBody from "@codeup/components/editor/CollaboratorManagerBody";
import { Box, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { io, Socket } from "socket.io-client";
import PopupManager from "../../../global/PopupManager";
import { useLoggedIn } from "@codeup/hooks";
import Head from "next/head";
import { CHeading } from "@codeup/components/dist/global/CHeading";

export default function Contributors() {
  const router = useRouter();
  const { loggedIn, userInfo, loaded } = useLoggedIn();
  const [reactSocket, setReactSocket] = React.useState<Socket | null>(null);
  let socket: Socket | null = null;

  React.useEffect(() => {
    if (loaded) {
      if (!loggedIn) {
        router.push("/#login");
        window.dispatchEvent(new CustomEvent("codeup::open_login"));
      } else {
        if (router.query.project_id) {
          socket = io();
          setReactSocket(socket);
          registerSocket();
        }
      }
    }
  }, [loggedIn, userInfo, loaded, router]);

  const registerSocket = () => {
    if (socket) {
      socket.on("authenticate", (data: any) => {
        if (!data.authenticated) {
          router.push("/#login");
          window.dispatchEvent(new CustomEvent("codeup::open_login"));
        }
      });

      socket.emit("authenticate", localStorage.getItem("token") as string);

      // @ts-ignore
      window.__backup_socket = socket;
    }
  };
  return (
    <>
      <Head>
        <title>Mitwirkende - Editor - CodeUp</title>
      </Head>

      <EditorProjectLayout>
        <Box textAlign={"center"} pt={6}>
          <CHeading size={"xl"}>Mitwirkende</CHeading>
        </Box>
        {reactSocket ? (
          <>
            <CollaboratorManagerBody
              projectId={(router.query.project_id as string) || "0"}
              socket={reactSocket as Socket}
            />
          </>
        ) : (
          <></>
        )}
      </EditorProjectLayout>
    </>
  );
}
