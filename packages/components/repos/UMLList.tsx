/**
 * packages/components/repos/UMLList.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 15.12.2024
 *
 */

import * as React from "react";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import {
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  HStack,
  Button,
  Stack,
  Heading,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FaCode,
  FaExchangeAlt,
  FaEye,
  FaPen,
  FaPlus,
  FaSearch,
  FaSitemap,
  FaTrash,
} from "react-icons/fa";
import StackedMenu from "../menu/StackedMenu";
import StackedMenuItem from "../menu/StackedMenuItem";
import { FaCube } from "react-icons/fa6";
import PopupManager from "@codeup/web/src/global/PopupManager";
import UMLPreview from "../editorv2/uml/UMLPreview";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import UMLEditor from "../editorv2/uml/UMLEditor";
import CodeUpModal from "../codeup/CodeUpModal";

export default function UMLList(props: { repoId: string; isOwner: boolean }) {
  const [uml, setUml] = React.useState<any[]>([]);
  const { t } = useTranslation("user-page");
  const [query, setQuery] = React.useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentUml, setCurrentUml] = React.useState<any>(null);

  useEffect(() => {
    if (!props.repoId || props.repoId.trim() === "") return;

    reload();
  }, [props.repoId]);

  const reload = async () => {
    const res = await REST.Repositories.getUMLDiagrams(
      AccountManager.getActiveToken(),
      props.repoId
    );

    if (res.status === 200) {
      setUml(res.payload.diagrams);
    }
  };

  const create = async (type: string) => {
    const name = await PopupManager.promptAsync({
      title: t("repos.uml.create"),
      helperText: t("repos.uml.create.name"),
    });

    if (!name) return;

    const res = await REST.Repositories.createUMLDiagram(
      AccountManager.getActiveToken(),
      props.repoId,
      name,
      type,
      JSON.stringify({})
    );

    if (res.status === 200) {
      await reload();
    } else {
      await PopupManager.alertAsync({
        title: t("base:control.error"),
        description: t("base:control.error.request") + res.payload.error,
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
            <StackedMenu
              trigger={
                <Button variant={"brand"} leftIcon={<FaPlus />}>
                  {t("repos.uml.create")}
                </Button>
              }
            >
              <StackedMenuItem
                title={t("repos.uml.implementation")}
                description={t("repos.uml.implementation.text")}
                icon={<FaCube />}
                onClick={() => {
                  create("impl");
                }}
              />
              <StackedMenuItem
                title={t("repos.uml.er")}
                description={t("repos.uml.er.text")}
                icon={<FaSitemap />}
                onClick={() => {
                  create("er");
                }}
              />
              <StackedMenuItem
                title={t("repos.uml.seq")}
                description={t("repos.uml.seq.text")}
                icon={<FaExchangeAlt />}
                onClick={() => {
                  create("seq");
                }}
              />
              <StackedMenuItem
                title={t("repos.uml.adv")}
                description={t("repos.uml.adv.text")}
                icon={<FaCode />}
                onClick={() => {
                  create("adv");
                }}
              />
            </StackedMenu>
          </HStack>
          <Stack spacing={4} mt={4}>
            {uml
              .filter((u) => {
                if (query.trim() === "") return true;
                return u.name.toLowerCase().includes(query.toLowerCase());
              })
              .map((u) => (
                <>
                  <HStack
                    p={3}
                    rounded={"lg"}
                    bg={"gray.800"}
                    justifyContent={"space-between"}
                  >
                    <HStack gap={2}>
                      {u.type === "impl" && <FaCube />}
                      {u.type === "er" && <FaSitemap />}
                      {u.type === "seq" && <FaExchangeAlt />}
                      {u.type === "adv" && <FaCode />}
                      <Heading size={"md"}>{u.name}</Heading>
                    </HStack>
                    <HStack gap={2}>
                      <IconButton
                        aria-label={"View"}
                        icon={<FaEye />}
                        onClick={async () => {
                          await PopupManager.alertAsync({
                            title: t("repos.uml.preview"),
                            description: (
                              <>
                                <UMLPreview
                                  umlData={
                                    JSON.parse(u.data).content ||
                                    "@startuml\n\n@enduml"
                                  }
                                />
                              </>
                            ),
                            customSize: "full",
                          });
                        }}
                        variant={"brand"}
                      />
                      <StackedMenu
                        trigger={
                          <IconButton
                            variant={"brand"}
                            aria-label={"actions"}
                            display={props.isOwner ? "flex" : "none"}
                            icon={<BiDotsHorizontalRounded />}
                          />
                        }
                      >
                        <StackedMenuItem
                          title={t("repos.uml.delete")}
                          description={t("repos.uml.delete.text")}
                          icon={<FaTrash />}
                          onClick={async () => {
                            const res =
                              await REST.Repositories.deleteUMLDiagram(
                                AccountManager.getActiveToken(),
                                props.repoId,
                                u._id
                              );

                            if (res.status === 200) {
                              await reload();
                            } else {
                              await PopupManager.alertAsync({
                                title: t("base:control.error"),
                                description:
                                  t("base:control.error.request") +
                                  res.payload.error,
                              });
                            }
                          }}
                        />
                        <StackedMenuItem
                          title={t("repos.uml.edit")}
                          description={t("repos.uml.edit.text")}
                          icon={<FaPen />}
                          onClick={async () => {
                            setCurrentUml(u);
                            onOpen();
                          }}
                        />
                      </StackedMenu>
                    </HStack>
                  </HStack>
                </>
              ))}
          </Stack>
        </Box>
      </Box>
      <CodeUpModal
        onOpen={onOpen}
        onClose={onClose}
        isOpen={isOpen}
        customSize={"full"}
      >
        <UMLEditor
          uml={currentUml}
          updateUML={async (umlx) => {
            const res = await REST.Repositories.updateUMLDiagram(
              AccountManager.getActiveToken(),
              props.repoId,
              currentUml._id,
              currentUml.name,
              umlx.data
            );

            await reload();
          }}
        />
      </CodeUpModal>
    </>
  );
}
