/**
 * packages/components/ide/TemplateImporter.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.07.2022
 *
 */

import * as React from "react";
import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  Progress,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import REST from "@codeup/rest";

export default function TemplateImporter(props: { templateId: string }) {
  const [importProgress, setImportProgress] = useState(0);
  const {
    isOpen: isImportOpen,
    onOpen: onImportOpen,
    onClose: onImportClose,
  } = useDisclosure();

  const [importProgressMax, setImportProgressMax] = useState(0);
  const [importProgressCurrent, setImportProgressCurrent] = useState("");

  const [importFinished, setImportFinished] = useState(false);

  const [importedProjectId, setImportedProjectId] = useState("");

  const router = useRouter();

  let f = false;

  useEffect(() => {
    if (props.templateId && props.templateId !== "0" && !isImportOpen && !f) {
      f = true;
      const name = prompt("Gib einen Namen ein");
      onImportOpen();
      REST.IDE.useTemplate({
        token: localStorage.getItem("token") as string,
        templateId: props.templateId,
      }).then((useTemplateRes) => {
        REST.IDE.createProject({
          token: localStorage.getItem("token") as string,
          name: name || new Date().toLocaleTimeString(),
        }).then(async (createProjectRes) => {
          await REST.IDE.deleteFile({
            token: localStorage.getItem("token") as string,
            path: "/README.MD",
            projectId: createProjectRes.payload.project._id,
          });

          setImportProgressMax(useTemplateRes.payload.files.length);
          setImportProgress(0);

          for (const [index, file] of useTemplateRes.payload.files.entries()) {
            setImportProgressCurrent(file.path);

            await REST.IDE.saveFile({
              token: localStorage.getItem("token") as string,
              projectId: createProjectRes.payload.project._id,
              path: file.path,
              content: file.content,
            });

            setImportProgress(index + 1);
          }

          setImportProgress(0);
          setImportProgressCurrent("");
          setImportProgressMax(1);
          setImportedProjectId(createProjectRes.payload.project._id);

          setImportFinished(true);
        });
      });
    }
  }, [props.templateId]);

  return (
    <>
      {props.templateId && props.templateId !== "0" ? (
        <Modal isOpen={isImportOpen} onClose={onImportClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {importFinished ? "Import abgeschlossen" : "Importieren"}
            </ModalHeader>
            <ModalBody>
              {importFinished ? (
                <>
                  <Text color={"gray.400"}>
                    Der Import wurde abgeschlossen! Du kannst das Projekt nun
                    bearbeiten.
                  </Text>
                  <Stack direction={"column"} mt={"2rem"} gap={".4rem"}>
                    <Button
                      variant={"solid"}
                      colorScheme={"blue"}
                      onClick={() => {
                        router.push(
                          "/ide/project/" +
                            importedProjectId +
                            "#editor-wrapper-flex"
                        );
                      }}
                    >
                      Bearbeiten
                    </Button>
                    <Button
                      variant={"outline"}
                      onClick={() => {
                        setImportedProjectId("0");
                        onImportClose();
                        router.push("?component=open");
                      }}
                    >
                      Später
                    </Button>
                  </Stack>
                </>
              ) : (
                <>
                  <Progress
                    size={"lg"}
                    max={importProgressMax}
                    value={importProgress}
                    w={"100%"}
                    rounded={"xl"}
                    hasStripe
                  />
                  <Text color={"gray.500"}>
                    Importiere Datei <code>{importProgressCurrent}</code>
                  </Text>
                </>
              )}
            </ModalBody>
            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
      ) : null}
    </>
  );
}
