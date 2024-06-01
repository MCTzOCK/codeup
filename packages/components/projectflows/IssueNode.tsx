/**
 * packages/components/projectflows/IssueNode.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.06.2024
 *
 */

import * as React from "react";
import { useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  FormControl,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { CHeading } from "../global/CHeading";
import { FaSave } from "react-icons/fa";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "@codeup/web/src/global/PopupManager";
import { Handle, Position } from "reactflow";
import { IIssue } from "@codeup/web/src/types/IIssue";

export default function IssueNode({
  data,
  isConnectable,
}: {
  data: string;
  isConnectable: boolean;
}) {
  const onChange = useCallback((evt: any) => {}, []);

  const router = useRouter();

  const [issue, setIssue] = React.useState<IIssue | null>(null);

  const reloadIssue = async () => {
    if (data !== undefined && data.length > 0) {
      const projectID = data[0];
      const issueID = data[1];

      const res = await REST.Projects.getIssues(
        AccountManager.getActiveToken(),
        projectID,
        issueID
      );

      if (res.status === 200) {
        setIssue(res.payload.issue);
      }
    }
  };

  useEffect(() => {
    reloadIssue();
  }, [data]);

  return (
    <>
      <Box p={6} w={"100%"} bg={"gray.900"} rounded={"xl"}>
        <Handle
          type={"target"}
          position={Position.Left}
          isConnectable={isConnectable}
        />
        <Box textAlign={"center"}>
          <CHeading size={"xl"}>Problem</CHeading>
        </Box>
        <Box>
          <Text>{issue?.description || "Lade Problem..."}</Text>
        </Box>
        <Handle
          type={"source"}
          position={Position.Right}
          isConnectable={isConnectable}
        />
      </Box>
    </>
  );
}
