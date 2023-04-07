/**
 * packages/components/roadmap/ProjectIdeaSelectorNode.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.04.2023
 *
 */

import * as React from "react";
import { useCallback } from "react";
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

export default function ProjectIdeaSelectorNode({
  data,
  isConnectable,
}: {
  data: string;
  isConnectable: boolean;
}) {
  const onChange = useCallback((evt: any) => {}, []);

  const router = useRouter();

  return (
    <>
      <Box p={6} w={"100%"}>
        <SuperText>Idee</SuperText>
        <FormControl mb={2} mt={6} w={"100%"}>
          <Stack>
            <Textarea
              resize={"none"}
              placeholder={"Projekt Idee eingeben"}
              defaultValue={data}
              id={"project_idea_ta"}
            />
            <Button
              colorScheme={"green"}
              leftIcon={<FaSave />}
              onClick={async () => {
                const value = (
                  document.querySelector(
                    "#project_idea_ta"
                  ) as HTMLTextAreaElement
                ).value;

                const res = await REST.Roadmap.updateRoad({
                  token: AccountManager.getActiveToken(),
                  id: router.query.id as string,
                  update: {
                    projectIdea: value,
                  },
                });

                if (res.status !== 200) {
                  PopupManager.alert({
                    title: "Fehler",
                    description:
                      "Es ist ein Fehler aufgetreten: " + res.payload.error,
                  });
                }
              }}
            >
              Speichern
            </Button>
          </Stack>
        </FormControl>
        <Handle
          type={"source"}
          position={Position.Right}
          isConnectable={isConnectable}
        />
      </Box>
    </>
  );
}
