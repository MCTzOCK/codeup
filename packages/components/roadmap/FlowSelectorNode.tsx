/**
 * packages/components/roadmap/FlowSelectorNode.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.04.2023
 *
 */

import * as React from "react";
import { useCallback, useEffect } from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  Heading,
  IconButton,
  Image,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import SuperText from "../landingpage/SuperText";
import PopupManager from "@codeup/web/src/global/PopupManager";
import { FaPlus, FaSave, FaTrash } from "react-icons/fa";
import { useRouter } from "next/router";
import { Handle, Position } from "reactflow";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import AuthenticateLoadingIndicator from "../admin/AuthenticateLoadingIndicator";
import ListViewer from "../todo/ListViewer";

export default function FlowSelectorNode({
  data,
  isConnectable,
}: {
  data: string[];
  isConnectable: boolean;
}) {
  const onChange = useCallback((evt: any) => {}, []);

  const [loaded, setLoaded] = React.useState<boolean>(false);

  const [usedLists, setUsedLists] = React.useState<string[]>(data);

  const [availableLists, setAvailableLists] = React.useState<any[]>([]);

  const [lists, setLists] = React.useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    const res = await REST.ToDo.getV2Projects(AccountManager.getActiveToken());

    if (res.status === 200) {
      setAvailableLists(res.payload.projects);
    }

    let l1: any[] = [];
    for (const l of res.payload.projects) {
      if (usedLists.includes(l._id)) {
        l1.push(l);
      }
    }

    setLists(l1);
    setLoaded(true);
  };

  return (
    <>
      <Box p={6} w={"100%"}>
        <Handle
          type={"target"}
          position={Position.Left}
          isConnectable={isConnectable}
        />
        <SuperText>Flows</SuperText>
        {loaded ? (
          <>
            <Stack mt={6}>
              <Button
                colorScheme={"green"}
                leftIcon={<FaPlus />}
                onClick={async () => {
                  const name = await PopupManager.promptAsync({
                    title: "Neuer Flow",
                    inputType: "INPUT",
                    helperText: "Gib einen Namen für den neuen Flow ein",
                  });

                  if (!name) return;

                  const res = await REST.ToDo.createV2Project({
                    token: AccountManager.getActiveToken(),
                    name: name,
                  });

                  if (res.status !== 200) {
                    PopupManager.alert({
                      title: "Fehler",
                      description:
                        "Es ist ein Fehler aufgetreten: " + res.payload.error,
                    });
                    return;
                  }

                  reload();
                }}
              >
                Neuer Flow
              </Button>
            </Stack>
            <FormControl mb={2} mt={6} w={"100%"}>
              <AutoComplete
                suggestWhenEmpty
                openOnFocus
                emptyState={"Keine Flows gefunden"}
                onChange={async (v: string) => {
                  if (v === "") return;

                  (
                    document.querySelector(
                      "#course_ac_input"
                    ) as HTMLInputElement
                  ).value = "";

                  const list = availableLists.find((c) => c.name === v);

                  if (!list) return;

                  const res = await REST.Roadmap.updateRoad({
                    token: AccountManager.getActiveToken(),
                    id: router.query.id as string,
                    update: {
                      linkedFlows: [...usedLists, list._id],
                    },
                  });

                  if (res.status !== 200) {
                    PopupManager.alert({
                      title: "Fehler",
                      description:
                        "Es ist ein Fehler aufgetreten: " + res.payload.error,
                    });
                    return;
                  }

                  setLists(
                    lists.concat({
                      ...list,
                    })
                  );
                }}
              >
                <AutoCompleteInput
                  variant={"filled"}
                  placeholder={"Flow hinzufügen"}
                  id={"course_ac_input"}
                  w={"100%"}
                />
                <AutoCompleteList backgroundColor={"gray.800"} w={"100%"} p={4}>
                  {availableLists
                    .filter((a) => {
                      return !lists.find((l) => l._id === a._id);
                    })
                    .map((a) => {
                      return (
                        <>
                          <AutoCompleteItem
                            value={a.name}
                            key={"flow_" + a._id}
                            align={"center"}
                          />
                        </>
                      );
                    })}
                </AutoCompleteList>
              </AutoComplete>
            </FormControl>
            <Stack>
              <StackDivider />
              <Divider />
              {lists.map((l) => {
                return (
                  <>
                    <Flex
                      w={"100%"}
                      alignItems={"center"}
                      gap={5}
                      p={2}
                      _hover={{
                        cursor: "pointer",
                        backgroundColor: "gray.700",
                      }}
                      onClick={(e) => {
                        if (
                          !["button", "svg", "path"].includes(
                            (e.target as HTMLElement).tagName!.toLowerCase()
                          )
                        ) {
                          router.push("/planning/" + l._id);
                        }
                      }}
                    >
                      <Stack flex={"70%"}>
                        <Heading size={"md"}>{l.name}</Heading>
                      </Stack>
                      <IconButton
                        flex={"10%"}
                        aria-label={"Flow entfernen"}
                        icon={<FaTrash />}
                        colorScheme={"red"}
                        variant={"ghost"}
                        onClick={async () => {
                          if (
                            !(await PopupManager.confirmAsync({
                              title: "Flow entfernen",
                              question:
                                "Möchtest du den Flow wirklich entfernen?",
                            }))
                          ) {
                            return;
                          }

                          const res = await REST.Roadmap.updateRoad({
                            token: AccountManager.getActiveToken(),
                            id: router.query.id as string,
                            update: {
                              linkedFlows: data.filter((c) => c !== l._id),
                            },
                          });

                          if (res.status !== 200) {
                            PopupManager.alert({
                              title: "Fehler",
                              description:
                                "Es ist ein Fehler aufgetreten: " +
                                res.payload.error,
                            });
                            return;
                          }

                          setLists(lists.filter((c) => c._id !== l._id));
                        }}
                      />
                    </Flex>
                    <StackDivider />
                    <Divider />
                  </>
                );
              })}
            </Stack>
          </>
        ) : (
          <AuthenticateLoadingIndicator text={"Lade Flows..."} inline={true} />
        )}
        <Handle
          type={"source"}
          position={Position.Right}
          isConnectable={isConnectable}
        />
      </Box>
    </>
  );
}
