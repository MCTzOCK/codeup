/**
 * apps/web/src/pages/projects/[id]/static.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 31.05.2024
 *
 */

import * as React from "react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import { IProject } from "../../../types/IProject";
import { useRouter } from "next/router";
import { useEffect } from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../../global/PopupManager";
import EditorProjectLayout from "@codeup/components/dist/editorv2/EditorProjectLayout";
import {
  Box,
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import byteSize from "byte-size";
import { FaFileUpload, FaTrash } from "react-icons/fa";

export default function Static() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const [project, setProject] = React.useState<IProject | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!router || !router.query || !router.query.id) return;

    REST.Projects.project(
      AccountManager.getActiveToken(),
      router.query.id as string
    ).then(async (res) => {
      if (res.status === 200) {
        setProject(res.payload.project);

        reloadFiles();
      } else {
        PopupManager.alertAsync({
          title: "Fehler",
          description:
            "Das Projekt konnte nicht empfangen werden: " + res.payload.error,
        });
      }
    });
  }, [router, router.query, router.query.id]);

  const [files, setFiles] = React.useState<{ name: string; size: number }[]>(
    []
  );

  const reloadFiles = async () => {
    const x = await REST.Projects.files(
      AccountManager.getActiveToken(),
      router.query.id as string
    );

    if (x.status === 200) {
      setFiles(x.payload.filesArray);
    } else {
      PopupManager.alertAsync({
        title: "Fehler",
        description:
          "Die Dateien konnten nicht empfangen werden: " + x.payload.error,
      });
    }
  };

  return (
    <>
      <EditorProjectLayout project_id={router.query.id as string}>
        <Box p={2}>
          <Flex justifyContent={"center"}>
            <Box textAlign={"center"} maxW={"500px"}>
              <CHeading size={"lg"}>Statische Dateien</CHeading>
              <Text>
                Lade statische Dateien, wie Bilder hoch, damit du sie in deinem
                Projekt verwenden kannst. Bedenke, dass alle Dateien öffentlich
                zugänglich sind. Du solltest deshalb keine sensiblen Daten
                hochladen.
              </Text>
              <Button
                mt={4}
                variant={"brand"}
                leftIcon={<FaFileUpload />}
                onClick={async () => {
                  const fl = await PopupManager.uploadFileAsync({
                    title: "Datei hochladen",
                    helperText:
                      "Wähle eine Datei aus, die du hochladen möchtest",
                  });

                  if (!fl || fl.length === 0) return;

                  const file = fl[0];

                  const reader = new FileReader();

                  reader.onload = async () => {
                    const content = (reader.result as string).split(
                      ";base64,"
                    )[1];

                    console.log(content);

                    const x = await REST.Projects.uploadFile(
                      AccountManager.getActiveToken(),
                      router.query.id as string,
                      file.name,
                      content
                    );

                    if (x.status === 200) {
                      await reloadFiles();
                    } else {
                      PopupManager.alertAsync({
                        title: "Fehler",
                        description:
                          "Die Datei konnte nicht hochgeladen werden: " +
                          x.payload.error,
                      });
                    }
                  };

                  reader.readAsDataURL(file);
                }}
              >
                Datei hochladen
              </Button>
            </Box>
          </Flex>
          <TableContainer>
            <Table maxW={"100%"}>
              <Thead>
                <Th>Name</Th>
                <Th>Größe</Th>
                <Th>Aktionen</Th>
              </Thead>
              <Tbody>
                {files.map((file) => (
                  <Tr>
                    <Td>{file.name}</Td>
                    <Td>{byteSize(file.size).toString()}</Td>
                    <Td>
                      <Button
                        leftIcon={<FaTrash />}
                        colorScheme={"red"}
                        onClick={async () => {
                          if (
                            !(await PopupManager.confirmAsync({
                              title: "Löschen",
                              question:
                                "Möchtest du diese Datei wirklich löschen?",
                            }))
                          )
                            return;

                          const x = await REST.Projects.deleteFile(
                            AccountManager.getActiveToken(),
                            router.query.id as string,
                            file.name
                          );

                          if (x.status === 200) {
                            await reloadFiles();
                          } else {
                            PopupManager.alertAsync({
                              title: "Fehler",
                              description:
                                "Die Datei konnte nicht gelöscht werden: " +
                                x.payload.error,
                            });
                          }
                        }}
                      >
                        Löschen
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </EditorProjectLayout>
    </>
  );
}
