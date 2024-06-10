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
  Stack,
  Text,
} from "@chakra-ui/react";
import { CHeading } from "../global/CHeading";
import { FaFile, FaFolder, FaFolderPlus } from "react-icons/fa";
import EditorFileExplorerIcon from "./EditorFileExplorerIcon";

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
  renameDirectory: (path: string, newName: string) => void;
}) {
  const [currentPath, setCurrentPath] = React.useState<string[]>([]);
  const [parentEntry, setParentEntry] = React.useState<entry | null>(null);
  const [currentEntry, setCurrentEntry] = React.useState<entry | null>(
    props.fileTree
  );

  if (!props.fileTree) return <></>;

  return (
    <Stack gap={2}>
      <HStack justifyContent={"space-between"} gap={2}>
        <Text fontWeight={700} color={"brand.500"} fontSize={"lg"}>
          Explorer
        </Text>
        <HStack gap={2}>
          <IconButton aria-label={"Create File"} icon={<FaFile />} />
          <IconButton aria-label={"Create File"} icon={<FaFolderPlus />} />
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
                <Stack
                  p={2}
                  gap={2}
                  cursor={"pointer"}
                  rounded={"md"}
                  bg={"gray.800"}
                  w={"100%"}
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
                  <Flex fontSize={"2xl"} w={"100%"} justifyContent={"center"}>
                    <EditorFileExplorerIcon entry={entry as any} />
                  </Flex>
                  <Text textAlign={"center"}>{entry.name}</Text>
                </Stack>
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
