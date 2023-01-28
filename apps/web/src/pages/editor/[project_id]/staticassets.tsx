/**
 * apps/web/src/pages/editor/[project_id]/staticassets.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 28.01.23
 *
 */

import * as React from "react";
import EditorProjectLayout from "@codeup/components/editor/EditorProjectLayout";
import CollaboratorManagerBody from "@codeup/components/editor/CollaboratorManagerBody";
import {
  Button,
  ButtonGroup,
  Heading,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { io, Socket } from "socket.io-client";
import PopupManager from "../../../global/PopupManager";
import { useLoggedIn } from "@codeup/hooks";
import REST from "@codeup/rest/dist";
import byteSize from "byte-size";
import {
  FaExternalLinkAlt,
  FaExternalLinkSquareAlt,
  FaLink,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

export default function Contributors() {
  const router = useRouter();
  const { loggedIn, userInfo, loaded } = useLoggedIn();
  const [assets, setAssets] = React.useState<any[]>([]);
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
        } else {
          socket?.emit("editor:projects:static:assets", {
            id: router.query.project_id,
          });
        }
      });

      socket.on("editor:projects:static:assets", (data: any) => {
        if (data.success) {
          setAssets(data.files);
        } else {
          PopupManager.alert({
            title: "Fehler",
            description: data.error,
          });
        }
      });

      socket.on("editor:projects:static:assets:upload", (data: any) => {
        if (data.success) {
          socket?.emit("editor:projects:static:assets", {
            id: router.query.project_id,
          });
        } else {
          PopupManager.alert({
            title: "Fehler",
            description: data.error,
          });
        }
      });

      socket.on("editor:projects:static:assets:delete", (data: any) => {
        if (data.success) {
          socket?.emit("editor:projects:static:assets", {
            id: router.query.project_id,
          });
        } else {
          PopupManager.alert({
            title: "Fehler",
            description: data.error,
          });
        }
      });

      socket.emit("authenticate", localStorage.getItem("token") as string);

      // @ts-ignore
      window.__backup_socket = socket;
    }
  };
  return (
    <>
      <EditorProjectLayout>
        <Heading textAlign={"center"} size={"2xl"} mt={8}>
          Statische Daten
        </Heading>
        {reactSocket ? (
          <>
            <TableContainer mt={"2rem"} p={6}>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Hochladedatum</Th>
                    <Th>Größe</Th>
                    <Th>Aktion</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>
                      <b>Neue Datei hochladen</b>
                    </Td>
                    <Td />
                    <Td />
                    <Td>
                      <Button
                        colorScheme={"green"}
                        leftIcon={<FaPlus />}
                        onClick={async () => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.onchange = async (e: Event) => {
                            // @ts-ignore
                            if (e.target.files) {
                              const binaryData =
                                // @ts-ignore
                                await e.target.files[0]!.arrayBuffer();

                              const binary = new Uint8Array(binaryData);

                              reactSocket?.emit(
                                "editor:projects:static:assets:upload",
                                {
                                  id: router.query.project_id,
                                  // @ts-ignore
                                  fileName: e.target.files[0].name,
                                  fileContent: binary,
                                }
                              );
                            }
                          };

                          input.click();
                        }}
                      >
                        Hochladen
                      </Button>
                    </Td>
                  </Tr>
                  {assets.map((asset) => (
                    <Tr>
                      <Td>{asset.filename.split("/")[1]}</Td>
                      <Td>{new Date(asset.uploadDate).toLocaleString()}</Td>
                      <Td>{byteSize(asset.length).toString()}</Td>
                      <Td>
                        <ButtonGroup isAttached>
                          <IconButton
                            aria-label={"Löschen"}
                            colorScheme={"red"}
                            icon={<FaTrash />}
                            onClick={async () => {
                              if (
                                await PopupManager.confirmAsync({
                                  title: "Löschen",
                                  question:
                                    "Möchtest du diese Datei wirklich löschen?",
                                })
                              ) {
                                reactSocket?.emit(
                                  "editor:projects:static:assets:delete",
                                  {
                                    projectId: router.query.project_id,
                                    assetName: asset.filename.split("/")[1],
                                  }
                                );
                              }
                            }}
                          />
                          <IconButton
                            aria-label={"Kopieren"}
                            colorScheme={"green"}
                            icon={<FaLink />}
                            onClick={() => {
                              navigator.clipboard.writeText(
                                window.location.origin +
                                  "/editor-static/" +
                                  asset.filename
                              );
                            }}
                          />
                          <IconButton
                            aria-label={"Kopieren"}
                            colorScheme={"blue"}
                            icon={<FaExternalLinkAlt />}
                            onClick={() => {
                              window.open(
                                window.location.origin +
                                  "/editor-static/" +
                                  asset.filename,
                                "_blank"
                              );
                            }}
                          />
                        </ButtonGroup>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <></>
        )}
      </EditorProjectLayout>
    </>
  );
}
