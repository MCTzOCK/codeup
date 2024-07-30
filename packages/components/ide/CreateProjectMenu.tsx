/**
 * packages/components/ide/CreateProjectMenu.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.08.2022
 *
 */

import * as React from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useId, useState } from "react";
import * as generate from "project-name-generator";
import { FaFileImport, FaPlus } from "react-icons/fa";
import REST from "@codeup/rest";
import { HiTemplate } from "react-icons/hi";
import { BiRename } from "react-icons/bi";
import { FiRotateCcw } from "react-icons/fi";
import TemplatePicker from "./TemplatePicker";
import { useRouter } from "next/router";
import { CHeading } from "../global/CHeading";
import { useTranslation } from "next-i18next";

export default function CreateProjectMenu() {
  const toast = useToast();
  const nameId = useId();

  const [loading, setLoading] = useState<boolean>(false);

  const [section, setSection] = useState("menu");
  const { t } = useTranslation("ide");

  function Card(props: {
    icon: any;
    title: string;
    section?: string;
    onClick?: () => void;
  }) {
    return (
      <>
        <Box
          flex={"33%"}
          backgroundColor={"gray.700"}
          shadow={"xl"}
          rounded={"xl"}
          h={"100%"}
          cursor={"pointer"}
          onClick={() => {
            if (props.section) {
              setSection(props.section);
            }
            if (props.onClick) {
              props.onClick();
            }
          }}
        >
          <Flex direction={"row"} h={"100%"} w={"100%"}>
            <Flex
              flex={"30%"}
              fontSize={"6xl"}
              alignItems={"center"}
              justifyContent={"center"}
              h={"100%"}
              w={"100%"}
              color={"brand.500"}
            >
              {props.icon}
            </Flex>
            <Flex
              flex={"70%"}
              pl={".2rem"}
              justifyContent={"center"}
              h={"100%"}
              w={"100%"}
              direction={"column"}
            >
              <CHeading size={"xl"}>{props.title}</CHeading>
            </Flex>
          </Flex>
        </Box>
      </>
    );
  }

  const importFileInputId = useId();

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

  const [suggestedProjectName, setSuggestedProjectName] = useState(
    generate.default().dashed
  );

  return (
    <>
      <Flex alignItems={"center"} justifyContent={"center"} mt={"1.2rem"}>
        <Box
          w={["100%", "85%"]}
          minW={["100%", "85%"]}
          backgroundColor={"gray.900"}
          p={"1.2rem"}
          rounded={"xl"}
        >
          <Box textAlign={"center"}>
            <CHeading size={"xl"}>{t("projects.create")}</CHeading>
          </Box>
          <Divider mt={"1.2rem"} />
          {section === "menu" ? (
            <>
              <Box mt={"1.2rem"}>
                <Flex
                  direction={["column", "row"]}
                  gap={["1.2rem", "2rem"]}
                  h={["30vh", "15vh"]}
                >
                  <Card
                    icon={<FaPlus />}
                    title={t("projects.empty")}
                    section={"empty"}
                  />
                  <Card
                    icon={<FaFileImport />}
                    title={t("projects.import")}
                    onClick={async () => {
                      const element = document.getElementById(
                        importFileInputId
                      ) as HTMLInputElement;

                      element.click();

                      element.onchange = async (e) => {
                        const target = e.target as HTMLInputElement;

                        if (target && target.files) {
                          if (target.files.length > 0) {
                            const file = target.files.item(0);

                            if (file) {
                              try {
                                const data = JSON.parse(await file.text());
                                if (
                                  !(
                                    data.codeUp &&
                                    data.codeUp.version &&
                                    data.codeUp.version === "1.0"
                                  )
                                ) {
                                  toast({
                                    status: "error",
                                    position: "top",
                                    variant: "solid",
                                    isClosable: true,
                                    duration: 3000,
                                    title: t("base:control.error"),
                                    description: t(
                                      "projects.import.error.file.version"
                                    ),
                                  });
                                  return;
                                }

                                if (!(data.files && data.name)) {
                                  toast({
                                    status: "error",
                                    position: "top",
                                    variant: "solid",
                                    isClosable: true,
                                    duration: 3000,
                                    title: t("base:control.error"),
                                    description: t(
                                      "projects.import.error.file.empty"
                                    ),
                                  });
                                  return;
                                }

                                onImportOpen();

                                const cRes = await REST.IDE.createProject({
                                  token: localStorage.getItem(
                                    "token"
                                  ) as string,
                                  name:
                                    data.name +
                                    " - Impo. " +
                                    new Date().toLocaleTimeString(),
                                });

                                await REST.IDE.deleteFile({
                                  token: localStorage.getItem(
                                    "token"
                                  ) as string,
                                  projectId: cRes.payload.project._id,
                                  path: "/README.MD",
                                });

                                setImportProgressMax(data.files.length);
                                setImportProgress(0);

                                for (const [
                                  index,
                                  file,
                                ] of data.files.entries()) {
                                  setImportProgressCurrent(file.path);

                                  await REST.IDE.saveFile({
                                    token: localStorage.getItem(
                                      "token"
                                    ) as string,
                                    projectId: cRes.payload.project._id,
                                    path: file.path,
                                    content: file.content,
                                  });

                                  setImportProgress(index + 1);
                                }

                                setImportProgress(0);
                                setImportProgressCurrent("");
                                setImportProgressMax(1);
                                setImportedProjectId(cRes.payload.project._id);

                                setImportFinished(true);
                              } catch (e: any) {
                                toast({
                                  status: "error",
                                  position: "top",
                                  variant: "solid",
                                  isClosable: true,
                                  duration: 3000,
                                  title: t("base:control.error"),
                                  description:
                                    t("projects.import.error.file.read") +
                                    ": " +
                                    e.message,
                                });
                              }
                            }
                          }
                        }
                      };
                    }}
                  />
                  <Card
                    icon={<HiTemplate />}
                    title={t("projects.template")}
                    section={"templates"}
                  />
                </Flex>
              </Box>
            </>
          ) : null}
          {section === "empty" ? (
            <>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  setLoading(true);

                  const res = await REST.IDE.createProject({
                    token: localStorage.getItem("token") as string,
                    // @ts-ignore
                    name: e.target.elements[nameId].value,
                  });

                  if (res.status === 200) {
                    toast({
                      title: t("success"),
                      description: t("project.created"),
                      status: "success",
                      variant: "solid",
                      position: "top",
                      isClosable: true,
                    });
                    setLoading(false);
                    router.push("/ide?component=open");
                  } else {
                    setLoading(false);
                    toast({
                      title: t("base:control.error"),
                      description: res.payload.error,
                      status: "error",
                      variant: "solid",
                      position: "top",
                      isClosable: true,
                    });
                  }
                }}
                id={"c_form"}
              >
                <FormControl mt={"2rem"} isRequired>
                  <FormLabel>{t("project.name")}</FormLabel>
                  <InputGroup>
                    <InputLeftAddon>
                      <BiRename />
                    </InputLeftAddon>
                    <Input
                      disabled={loading}
                      type={"text"}
                      id={nameId}
                      placeholder={t("project.name")}
                    />
                  </InputGroup>
                </FormControl>
                <Text mt={"1.2rem"}>
                  {t("project.name.suggestion")}&nbsp;
                  <Link
                    color={"brand.500"}
                    onClick={() => {
                      (
                        document.getElementById(nameId) as HTMLInputElement
                      ).value = suggestedProjectName;
                      (
                        document.getElementById("c_for_sb") as HTMLButtonElement
                      ).click();
                    }}
                  >
                    {suggestedProjectName}
                  </Link>
                  <Tooltip label={t("project.name.suggestion.new")} hasArrow>
                    <IconButton
                      ml={".6rem"}
                      aria-label={"regenerate"}
                      icon={<FiRotateCcw />}
                      variant={"ghost"}
                      onClick={() => {
                        setSuggestedProjectName(generate.default().dashed);
                      }}
                    />
                  </Tooltip>
                </Text>
                <FormControl mt={"1.2rem"}>
                  <Button
                    isLoading={loading}
                    id="c_for_sb"
                    type={"submit"}
                    variant={"brand"}
                  >
                    {t("project.create")}
                  </Button>
                </FormControl>
              </form>
            </>
          ) : null}
          {section === "templates" ? (
            <>
              <TemplatePicker />
            </>
          ) : null}
        </Box>
      </Flex>
      <input
        type={"file"}
        id={importFileInputId}
        style={{ visibility: "hidden" }}
        accept={".cupp,.codeup"}
      />

      <Modal isOpen={isImportOpen} onClose={onImportClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {importFinished
              ? t("project.import.finished")
              : t("projects.import")}
          </ModalHeader>
          <ModalBody>
            {importFinished ? (
              <>
                <Text color={"gray.400"}>
                  {t("project.import.finished.text")}
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
                    {t("edit")}
                  </Button>
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      setImportedProjectId("0");
                      onImportClose();
                    }}
                  >
                    {t("later")}
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
                  {t("project.import.current.file")}{" "}
                  <code>{importProgressCurrent}</code>
                </Text>
              </>
            )}
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
