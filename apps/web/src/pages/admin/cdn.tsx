/**
 * apps/web/src/pages/admin/cdn.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.07.2024
 *
 */

import * as React from "react";
import Head from "next/head";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  chakra,
  Divider,
  Flex,
  Stack,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Td,
  Th,
  Input,
  IconButton,
  CircularProgress,
  Heading,
  MenuList,
  MenuItem,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { CHeading } from "@codeup/components/global/CHeading";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../global/PopupManager";
import { FaFolder, FaUpload } from "react-icons/fa6";
import { FaFile, FaInfoCircle, FaPen, FaSync, FaTrash } from "react-icons/fa";
import byteSize from "byte-size";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import { ContextMenu } from "chakra-ui-contextmenu";

type IEntry = {
  name: string;
  size: number;
  etag: string;
  lastModified: string;
  children: IEntry[];
};

export default function Cdn() {
  const [objects, setObjects] = React.useState<IEntry[]>([]);
  const [currentPath, setCurrentPath] = React.useState<string[]>([]);
  const [currentObjects, setCurrentObjects] = React.useState<IEntry[]>([]);
  const [query, setQuery] = React.useState<string>("");

  React.useEffect(() => {
    reloadObjects();
  }, []);

  React.useEffect(() => {
    let currentObjects = objects;
    for (const path of currentPath) {
      for (const object of currentObjects) {
        if (object.name === path) {
          currentObjects = object.children;
          break;
        }
      }
    }
    setCurrentObjects(currentObjects);
  }, [currentPath, objects]);

  const reloadObjects = async () => {
    const res = await REST.Admin.CDN.list(AccountManager.getActiveToken());

    if (res.status !== 200) {
      await PopupManager.alertAsync({
        title: "Fehler",
        description:
          "Objekte konnten nicht geladen werden: " + res.payload.error,
      });

      return;
    }

    let entries: IEntry[] = [];

    for (const entry of res.payload.data as {
      name: string;
      size: number;
      etag: string;
      lastModified: string;
    }[]) {
      // Split the name by / and create a tree out of it
      // Add the metadata of the file (size, etag, lastModified)
      // The returned file name of the S3 API is always the full path

      const parts = entry.name.split("/");
      let currentEntry = entries;
      let currentPath = "";
      for (let i = 0; i < parts.length; i++) {
        currentPath += parts[i] + "/";
        let found = false;
        for (const e of currentEntry) {
          if (e.name === parts[i]) {
            currentEntry = e.children;
            found = true;
            break;
          }
        }
        if (!found) {
          const newEntry: IEntry = {
            name: parts[i],
            size: i === parts.length - 1 ? entry.size : 0,
            etag: i === parts.length - 1 ? entry.etag : "",
            lastModified: i === parts.length - 1 ? entry.lastModified : "",
            children: [],
          };
          currentEntry.push(newEntry);
          currentEntry = newEntry.children;
        }
      }
    }

    setObjects(entries);
  };

  return (
    <>
      <Head>
        <title>CDN - Admin - CodeUp</title>
      </Head>
      <AdminLayout>
        <Box p={6}>
          <CHeading size={"xl"} textAlign={"center"}>
            Content Delivery Network
          </CHeading>
          <Flex justifyContent={"center"} mt={8} p={2} maxW={"100vw"}>
            <Box
              maxW={"1250px"}
              bg={"gray.900"}
              rounded={"md"}
              p={6}
              h={"100%"}
              w={"100%"}
              //minW={"fit-content"}
            >
              <Flex
                direction={["column", "column", "row"]}
                alignItems={"center"}
                justifyContent={"space-between"}
                mb={4}
              >
                <Breadcrumb separator={"/"}>
                  <BreadcrumbItem />
                  <BreadcrumbItem key={"root-cdn-bci"}>
                    <BreadcrumbLink
                      color={"brand.500"}
                      onClick={() => {
                        setCurrentPath([]);
                      }}
                    >
                      CodeUp CDN v2
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {currentPath.map((path, i) => (
                    <BreadcrumbItem key={i}>
                      <BreadcrumbLink
                        color={"brand.500"}
                        onClick={() => {
                          setCurrentPath(currentPath.slice(0, i + 1));
                        }}
                      >
                        {path}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  ))}
                  <BreadcrumbItem />
                </Breadcrumb>
                <Flex
                  direction={["column", "column", "row"]}
                  alignItems={"center"}
                  gap={2}
                >
                  <IconButton
                    aria-label={"Refresh"}
                    icon={<FaSync />}
                    onClick={reloadObjects}
                    variant={"brand"}
                  />
                  <IconButton
                    aria-label={"Upload"}
                    icon={<FaUpload />}
                    onClick={async () => {
                      const files = await PopupManager.uploadFileAsync({
                        title: "Datei hochladen",
                        helperText:
                          "Wähle die Datei aus, die du im aktuellen Verzeichnis des CDN hochladen möchtest.",
                      });

                      const path = await PopupManager.promptAsync({
                        title: "Pfad",
                        helperText:
                          "Wenn du die Datei an einem anderen Pfad hochladen möchtest, gib ihn hier ein. (Neue Pfade werden erstellt)",
                      });

                      if (!files || !files.item(0)) return;

                      const file = files.item(0)!;

                      if (!file) return;

                      let name = "";

                      if (path) {
                        name = path + "/" + file.name;
                      } else {
                        name = currentPath.join("/") + "/" + file.name;
                      }
                      const reader = new FileReader();

                      reader.onload = async () => {
                        let result = reader.result as string;

                        result = result.replace(/^data:.+;base64,/g, "");

                        PopupManager.alertAsync({
                          title: "Hochladen",
                          description: (
                            <Flex
                              w={"100%"}
                              h={"fit-content"}
                              justifyContent={"center"}
                              alignItems={"center"}
                              direction={"column"}
                              p={6}
                            >
                              <CircularProgress
                                size={"80px"}
                                isIndeterminate
                                color="brand.500"
                              />
                              <Heading size={"lg"} mt={4}>
                                Hochladen...
                              </Heading>
                            </Flex>
                          ),
                          customSize: "2xl",
                        });

                        const res = await REST.Admin.CDN.upload({
                          token: AccountManager.getActiveToken(),
                          name: name,
                          file: result,
                        });

                        if (res.status !== 200) {
                          await PopupManager.alertAsync({
                            title: "Fehler",
                            description:
                              "Datei konnte nicht hochgeladen werden: " +
                              res.payload.error,
                          });

                          return;
                        }

                        await PopupManager.alertAsync({
                          title: "Erfolg",
                          description: "Datei wurde erfolgreich hochgeladen.",
                        });

                        reloadObjects();
                      };

                      reader.readAsDataURL(file);
                    }}
                    variant={"brand"}
                  />
                </Flex>
              </Flex>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={"Suchen..."}
              />
              <Box my={4} />
              <TableContainer maxW={"100vw"}>
                <Table>
                  <Thead>
                    <Th></Th>
                    <Th>Name</Th>
                    <Th>Größe</Th>
                    <Th>Geändert</Th>
                    <Th>ETag</Th>
                  </Thead>
                  <Tbody>
                    {currentObjects
                      .filter((object) => {
                        return object.name
                          .toLowerCase()
                          .includes(query.toLowerCase());
                      })
                      .sort((a, b) => {
                        if (a.children.length > 0 && b.children.length === 0) {
                          return -1;
                        }
                        if (a.children.length === 0 && b.children.length > 0) {
                          return 1;
                        }
                        return 0;
                      })
                      .map((object) => (
                        <ContextMenu
                          renderMenu={() => {
                            if (object.children.length !== 0) {
                              return <></>;
                            }

                            return (
                              <>
                                <MenuList bg={"#000"}>
                                  <MenuItem
                                    icon={<FaTrash />}
                                    color={"red.500"}
                                    onClick={async () => {
                                      if (
                                        !(await PopupManager.confirmAsync({
                                          title: "Löschen",
                                          question:
                                            "Möchtest du die Datei wirklich löschen?",
                                        }))
                                      )
                                        return;

                                      const res = await REST.Admin.CDN.delete({
                                        token: AccountManager.getActiveToken(),
                                        name:
                                          currentPath.join("/") +
                                          "/" +
                                          object.name,
                                      });

                                      if (res.status !== 200) {
                                        await PopupManager.alertAsync({
                                          title: "Fehler",
                                          description:
                                            "Datei konnte nicht gelöscht werden: " +
                                            res.payload.error,
                                        });

                                        return;
                                      }

                                      await PopupManager.alertAsync({
                                        title: "Erfolg",
                                        description:
                                          "Datei wurde erfolgreich gelöscht.",
                                      });

                                      await reloadObjects();
                                    }}
                                  >
                                    Löschen
                                  </MenuItem>
                                </MenuList>
                              </>
                            );
                          }}
                        >
                          {(ref) => (
                            <Tr
                              key={object.name}
                              ref={ref as any}
                              _hover={{
                                bg: "gray.700",
                              }}
                              cursor={"pointer"}
                              onClick={() => {
                                if (object.children.length > 0) {
                                  setCurrentPath([...currentPath, object.name]);
                                } else {
                                  window.open(
                                    "https://cdn.codeup.space/" +
                                      currentPath.join("/") +
                                      "/" +
                                      object.name,
                                    "_blank"
                                  );
                                }
                              }}
                            >
                              <Td>
                                {object.children.length === 0 ? (
                                  <FaFile />
                                ) : (
                                  <chakra.span color={"brand.500"}>
                                    <FaFolder />
                                  </chakra.span>
                                )}
                              </Td>
                              <Td>{object.name}</Td>
                              <Td>{byteSize(object.size).toString()}</Td>
                              <Td>
                                {object.lastModified === ""
                                  ? object.lastModified
                                  : new Date(
                                      object.lastModified
                                    ).toLocaleString()}
                              </Td>
                              <Td>{object.etag}</Td>
                            </Tr>
                          )}
                        </ContextMenu>
                      ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </Flex>
        </Box>
      </AdminLayout>
    </>
  );
}
