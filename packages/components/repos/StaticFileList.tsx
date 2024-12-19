/**
 * packages/components/repos/StaticFileList.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.12.2024
 *
 */

import * as React from "react";
import { useTranslation } from "next-i18next";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "@codeup/web/src/global/PopupManager";
import { useEffect } from "react";
import {
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  HStack,
  Button,
  Stack,
  IconButton,
} from "@chakra-ui/react";
import {
  FaCloudUploadAlt,
  FaFileUpload,
  FaLink,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import byteSize from "byte-size";

export default function StaticFileList(props: { repoId: string }) {
  const [files, setFiles] = React.useState<{ name: string; size: number }[]>(
    []
  );

  const [query, setQuery] = React.useState<string>("");

  const { t } = useTranslation("projects");

  useEffect(() => {
    if (!props.repoId) return;

    reloadFiles();
  }, [props.repoId]);

  const reloadFiles = async () => {
    const x = await REST.Repositories.s3Objects(
      AccountManager.getActiveToken(),
      props.repoId
    );

    if (x.status === 200) {
      setFiles(x.payload.filesArray);
    } else {
      PopupManager.alertAsync({
        title: t("base:control.error"),
        description: t("static.loading.error") + ": " + x.payload.error,
      });
    }
  };

  return (
    <>
      <Box w={"100%"} minH={"80vh"} display={"flex"} justifyContent={"center"}>
        <Box w={"100%"} maxW={"1600px"} rounded={"lg"} bg={"gray.900"} p={4}>
          <HStack justifyContent={"space-between"} gap={4}>
            <InputGroup>
              <InputLeftElement>
                <FaSearch />
              </InputLeftElement>
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                placeholder={t("base:control.search")}
              />
            </InputGroup>
            <IconButton
              variant={"brand"}
              icon={<FaCloudUploadAlt />}
              aria-label={"Upload"}
              onClick={async () => {
                const fl = await PopupManager.uploadFileAsync({
                  title: t("static.upload.file"),
                  helperText: t("static.upload.file.helper") + " (max. 10MB)",
                });

                if (!fl || fl.length === 0) return;

                const file = fl[0];

                const reader = new FileReader();

                reader.onload = async () => {
                  const content = (reader.result as string).split(
                    ";base64,"
                  )[1];

                  console.log(content);

                  const x = await REST.Repositories.uploadS3Object(
                    AccountManager.getActiveToken(),
                    props.repoId,
                    file.name,
                    content
                  );

                  if (x.status === 200) {
                    await reloadFiles();
                  } else {
                    PopupManager.alertAsync({
                      title: t("base:control.error"),
                      description:
                        t("static.upload.error") + ": " + x.payload.error,
                    });
                  }
                };

                reader.readAsDataURL(file);
              }}
            />
          </HStack>
          <Stack spacing={"md"} pt={4}>
            {files
              .filter((f) => {
                if (query.trim() === "") return true;
                return f.name.toLowerCase().includes(query.toLowerCase());
              })
              .map((file) => (
                <HStack justifyContent={"space-between"} key={file.name}>
                  <Box>
                    {file.name} ({byteSize(file.size).toString()})
                  </Box>
                  <HStack gap={2}>
                    <IconButton
                      colorScheme={"red"}
                      icon={<FaTrash />}
                      aria-label={"delete"}
                      onClick={async () => {
                        if (
                          !(await PopupManager.confirmAsync({
                            title: t("delete"),
                            question: t("static.delete.confirm"),
                          }))
                        )
                          return;

                        const x = await REST.Repositories.deleteS3Object(
                          AccountManager.getActiveToken(),
                          props.repoId,
                          file.name
                        );

                        if (x.status === 200) {
                          await reloadFiles();
                        } else {
                          PopupManager.alertAsync({
                            title: t("base:control.error"),
                            description:
                              t("static.delete.error") + ": " + x.payload.error,
                          });
                        }
                      }}
                    />
                    <IconButton
                      variant={"brand"}
                      icon={<FaLink />}
                      aria-label={"url"}
                      onClick={async () => {
                        PopupManager.alertAsync({
                          title: t("url"),
                          description: (
                            <>
                              <Input
                                type={"text"}
                                placeholder={t("url")}
                                value={
                                  window.location.origin +
                                  "/api/s3/" +
                                  props.repoId +
                                  "/" +
                                  file.name
                                }
                              />
                            </>
                          ),
                        });
                      }}
                    />
                  </HStack>
                </HStack>
              ))}
          </Stack>
        </Box>
      </Box>
    </>
  );
}
