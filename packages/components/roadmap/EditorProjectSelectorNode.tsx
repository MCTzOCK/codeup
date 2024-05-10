/**
 * packages/components/roadmap/EditorProjectSelectorNode.tsx
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
import { FaSave, FaTrash } from "react-icons/fa";
import { useRouter } from "next/router";
import { Handle, Position } from "reactflow";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import AuthenticateLoadingIndicator from "../admin/AuthenticateLoadingIndicator";
import { CHeading } from "../global/CHeading";

export default function EditorProjectSelectorNode({
  data,
  isConnectable,
}: {
  data: string;
  isConnectable: boolean;
}) {
  const onChange = useCallback((evt: any) => {}, []);
  const [loaded, setLoaded] = React.useState<boolean>(false);

  const [availableProjects, setAvailableProjects] = React.useState<
    {
      _id: string;
      name: string;
    }[]
  >([]);

  const [project, setProject] = React.useState<{
    _id: string;
    name: string;
  }>();

  const router = useRouter();

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    const res = await REST.Editor.getProjectsV2(
      AccountManager.getActiveToken()
    );

    setLoaded(true);

    if (res.status === 200) {
      setAvailableProjects(res.payload.projects);

      if (data === undefined || data.length === 0) return;

      setProject(res.payload.projects.find((p: any) => p._id === data));
    }
  };

  return (
    <>
      <Box
        p={6}
        w={"100%"}
        borderWidth={"2px"}
        borderStyle={"solid"}
        rounded={"xl"}
        borderColor={"brand.500"}
        bg={"gray.900"}
      >
        <Handle
          type={"target"}
          position={Position.Left}
          isConnectable={isConnectable}
        />
        <Box textAlign={"center"}>
          <CHeading size={"xl"}>Projekt</CHeading>
        </Box>
        {loaded ? (
          <>
            <FormControl mb={2} mt={6} w={"100%"}>
              <AutoComplete
                suggestWhenEmpty
                openOnFocus
                emptyState={"Keine Projekte gefunden"}
                onChange={async (v: string) => {
                  if (v === "") return;

                  (
                    document.querySelector(
                      "#course_ac_input"
                    ) as HTMLInputElement
                  ).value = "";

                  const project = availableProjects.find(
                    (p: any) => p.name === v
                  );

                  if (!project) return;

                  const res = await REST.Roadmap.updateRoad({
                    token: AccountManager.getActiveToken(),
                    id: router.query.id as string,
                    update: {
                      linkedProject: project._id,
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

                  setProject(project);
                  setAvailableProjects(
                    availableProjects.filter((p: any) => p._id !== project._id)
                  );
                }}
              >
                <AutoCompleteInput
                  variant={"filled"}
                  placeholder={"Projekt verbinden"}
                  id={"todo_ac_input"}
                  w={"100%"}
                />
                <AutoCompleteList backgroundColor={"gray.900"} w={"100%"} p={4}>
                  {availableProjects
                    .filter((a) => {
                      if (!project) return true;

                      return a._id !== project!._id;
                    })
                    .map((a) => {
                      return (
                        <>
                          <AutoCompleteItem
                            value={a.name}
                            key={"project_" + a._id}
                            align={"center"}
                          />
                        </>
                      );
                    })}
                </AutoCompleteList>
              </AutoComplete>
            </FormControl>
            {project && (
              <Stack>
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
                      router.push("/editor/" + project._id);
                    }
                  }}
                >
                  <Stack flex={"70%"}>
                    <Heading size={"md"}>{project.name}</Heading>
                  </Stack>
                  <IconButton
                    flex={"10%"}
                    aria-label={"Projekt entfernen"}
                    icon={<FaTrash />}
                    colorScheme={"red"}
                    variant={"ghost"}
                    onClick={async () => {
                      if (
                        !(await PopupManager.confirmAsync({
                          title: "Projekt entfernen",
                          question: "Möchtest du das Projekt entfernen?",
                        }))
                      ) {
                        return;
                      }

                      const res = await REST.Roadmap.updateRoad({
                        token: AccountManager.getActiveToken(),
                        id: router.query.id as string,
                        update: {
                          linkedProject: "",
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

                      setProject(undefined);
                      setAvailableProjects([
                        ...availableProjects,
                        project as any,
                      ]);
                    }}
                  />
                </Flex>
              </Stack>
            )}
          </>
        ) : (
          <>
            <AuthenticateLoadingIndicator text={"Lade Projekte..."} inline />
          </>
        )}
      </Box>
    </>
  );
}
