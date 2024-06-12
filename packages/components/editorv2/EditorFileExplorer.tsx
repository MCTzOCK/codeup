/**
 * packages/components/editorv2/EditorFileExplorer.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 10.06.2024
 *
 */

import * as React from "react";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Flex,
  Grid,
  HStack,
  IconButton,
  ListIcon,
  ListItem,
  MenuItem,
  MenuList,
  Stack,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { CHeading } from "../global/CHeading";
import {
  FaFile,
  FaFolder,
  FaFolderPlus,
  FaInfoCircle,
  FaPen,
  FaTrash,
} from "react-icons/fa";
import EditorFileExplorerIcon from "./EditorFileExplorerIcon";
import { ContextMenu } from "chakra-ui-contextmenu";
import PopupManager from "@codeup/web/src/global/PopupManager";
import byteSize from "byte-size";
import { useEffect } from "react";

type entry = {
  name: string;
  type: string;
  children: entry[];
  content?: any;
};

export default function EditorFileExplorer(props: {
  projectName: string;
  fileTree: entry;
  deleteFile: (path: string) => void;
  createFile: (path: string) => void;
  createDirectory: (path: string) => void;
  openFile: (path: string) => void;
  renameFile: (path: string, newName: string) => void;
}) {
  const [currentPath, setCurrentPath] = React.useState<string[]>([]);
  const [parentEntry, setParentEntry] = React.useState<entry | null>(null);
  const [currentEntry, setCurrentEntry] = React.useState<entry | null>(
    props.fileTree
  );

  useEffect(() => {
    if (currentPath.length > 0) {
      setCurrentEntry(findEntryByPath(props.fileTree, currentPath));
    } else {
      setCurrentEntry(props.fileTree);
      setCurrentPath([]);
    }
  }, [props.fileTree]);

  if (!props.fileTree) return <></>;

  return (
    <Stack gap={2}>
      <HStack justifyContent={"space-between"} gap={2}>
        <Text fontWeight={700} color={"brand.500"} fontSize={"lg"}>
          Explorer
        </Text>
        <HStack gap={2}>
          <IconButton
            aria-label={"Create File"}
            icon={<FaFile />}
            onClick={async () => {
              const name = await PopupManager.promptAsync({
                title: "Neue Datei",
                helperText: "Bitte gib den Namen der neuen Datei ein.",
              });

              if (!name) return;

              props.createFile(currentPath.concat(name).join("/"));
            }}
          />
          <IconButton
            aria-label={"Create File"}
            icon={<FaFolderPlus />}
            onClick={async () => {
              const name = await PopupManager.promptAsync({
                title: "Neuer Ordner",
                helperText: "Bitte gib den Namen des neuen Ordners ein.",
              });

              if (!name) return;

              props.createDirectory(currentPath.concat(name).join("/"));
            }}
          />
        </HStack>
      </HStack>
      <Breadcrumb>
        <BreadcrumbItem>
          <Text
            color={"brand.500"}
            cursor={"pointer"}
            onClick={() => {
              setCurrentPath([]);
              setCurrentEntry(props.fileTree);
            }}
          >
            {props.projectName}
          </Text>
        </BreadcrumbItem>
        {currentPath.map((path, index) => (
          <BreadcrumbItem
            key={index}
            isCurrentPage={index === currentPath.length - 1}
          >
            <Text
              color={"brand.500"}
              cursor={"pointer"}
              onClick={() => {
                setCurrentPath(currentPath.slice(0, index + 1));
                setCurrentEntry(
                  findEntryByPath(
                    props.fileTree,
                    currentPath.slice(0, index + 1)
                  )
                );
              }}
            >
              {path}
            </Text>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
      <Grid
        templateColumns={"repeat(auto-fit, minmax(150px, 1fr))"}
        autoColumns={"minmax(0,1fr)"}
        gap={6}
      >
        {currentEntry &&
          currentEntry.children
            .sort((a, b) => {
              if (a.type === "directory" && b.type === "file") {
                return -1;
              } else if (a.type === "file" && b.type === "directory") {
                return 1;
              } else {
                return 0;
              }
            })
            .map((entry, index) => {
              return (
                <ContextMenu
                  renderMenu={() => (
                    <>
                      <MenuList bg={"#000"}>
                        <MenuItem
                          icon={<FaInfoCircle />}
                          onClick={async () => {
                            await PopupManager.alertAsync({
                              title: entry.name,
                              description: (
                                <>
                                  <UnorderedList spacing={2}>
                                    <ListItem>Name: {entry.name}</ListItem>
                                    <ListItem>Typ: {entry.type}</ListItem>
                                    {entry.content && (
                                      <ListItem>
                                        Größe:{" "}
                                        {byteSize(
                                          entry.content.length
                                        ).toString()}
                                      </ListItem>
                                    )}
                                  </UnorderedList>
                                </>
                              ),
                            });
                          }}
                        >
                          Informationen
                        </MenuItem>
                        <MenuItem
                          icon={<FaTrash />}
                          color={"red.500"}
                          onClick={() => {
                            props.deleteFile(
                              currentPath.concat(entry.name).join("/")
                            );
                          }}
                        >
                          Löschen
                        </MenuItem>
                        <MenuItem
                          icon={<FaPen />}
                          color={"brand.500"}
                          onClick={async () => {
                            const newName = await PopupManager.promptAsync({
                              title: "Neuer Name",
                              helperText:
                                "Bitte geben Sie den neuen Namen ein. Tipp: Um eine Datei zu verschieben, gib den neuen relativen Pfad ein (z.B. ../public/index.css)",
                            });

                            if (!newName) return;

                            props.renameFile(
                              currentPath.concat(entry.name).join("/"),
                              newName
                            );
                          }}
                        >
                          Umbenennen
                        </MenuItem>
                      </MenuList>
                    </>
                  )}
                >
                  {(ref) => (
                    <Stack
                      p={2}
                      gap={2}
                      cursor={"pointer"}
                      rounded={"md"}
                      bg={"gray.800"}
                      w={"100%"}
                      ref={ref as any}
                      onClick={() => {
                        if (entry.type === "file") {
                          props.openFile(entry.name);
                        } else {
                          setCurrentPath([...currentPath, entry.name]);
                          setParentEntry(currentEntry);
                          setCurrentEntry(entry);
                        }
                      }}
                    >
                      <Flex
                        fontSize={"2xl"}
                        w={"100%"}
                        justifyContent={"center"}
                      >
                        <EditorFileExplorerIcon entry={entry as any} />
                      </Flex>
                      <Text textAlign={"center"}>{entry.name}</Text>
                    </Stack>
                  )}
                </ContextMenu>
              );
            })}
      </Grid>
    </Stack>
  );
}

const findEntryByPath = (entry: entry, path: string[]): entry | null => {
  if (path.length === 0) return entry;
  const next = entry.children.find((c) => c.name === path[0]);
  if (!next) return null;
  return findEntryByPath(next, path.slice(1));
};
