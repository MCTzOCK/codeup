/**
 * apps/web/src/pages/roadmap/[id].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.04.2023
 *
 */

import * as React from "react";
import { useLoggedIn } from "@codeup/hooks";
import { useRouter } from "next/router";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import SuperText from "@codeup/components/landingpage/SuperText";
import {
  Box,
  chakra,
  Divider,
  Flex,
  FormControl,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  Handle,
  MarkerType,
  MiniMap,
  Node,
  NodeChange,
  Position,
  ReactFlowInstance,
} from "reactflow";
import { useCallback, useEffect, useMemo } from "react";
import CourseSelectorNode from "@codeup/components/roadmap/CourseSelectorNode";
import ProjectIdeaSelectorNode from "@codeup/components/roadmap/ProjectIdeaSelectorNode";
import ToDoSelectorNode from "@codeup/components/roadmap/ToDoSelectorNode";
import FlowSelectorNode from "@codeup/components/roadmap/FlowSelectorNode";
import EditorProjectSelectorNode from "@codeup/components/roadmap/EditorProjectSelectorNode";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { sProp } from "../../global/i18nstaticProps";
import Head from "next/head";
import { useTranslation } from "next-i18next";

export default function RoadmapViewer() {
  const { t } = useTranslation("roadmap");
  const nodeTypes = useMemo(
    () => ({
      courseSelector: CourseSelectorNode,
      projectIdeaSelector: ProjectIdeaSelectorNode,
      todoSelector: ToDoSelectorNode,
      flowSelector: FlowSelectorNode,
      editorProjectSelector: EditorProjectSelectorNode,
    }),
    []
  );

  const { loggedIn, loaded, userInfo } = useLoggedIn();
  const [roadmap, setRoadmap] = React.useState<{
    owner: string;
    _id: string;
    name: string;
    projectIdea: string;
    linkedProject: string;
    linkedCourses: string[];
    linkedFlows: string[];
    linkedTodos: string[];
  }>();
  const router = useRouter();

  React.useEffect(() => {
    if (loaded && !loggedIn) {
      router.push("/#login");
      window.dispatchEvent(new CustomEvent("codeup::open_login"));
    } else if (loaded && loggedIn) {
      reload();
    }
  }, [loggedIn, loaded, userInfo]);

  const reload = async () => {
    const res = await REST.Roadmap.getRoad({
      token: AccountManager.getActiveToken(),
      id: router.query.id as string,
    });

    if (res.status !== 200) {
      router.push("/roadmap");
      return;
    }

    setRoadmap(res.payload.roadmap);
  };

  const [nodes, setNodes] = React.useState<Node[]>([]);
  const [edges, setEdges] = React.useState<Edge[]>([]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const [currentEdge, setCurrentEdge] = React.useState<Edge | null>(null);
  const [currentNode, setCurrentNode] = React.useState<Node | null>(null);

  const [lastEdgeId, setLastEdgeId] = React.useState<string>("");
  const [lastNodeId, setLastNodeId] = React.useState<string>("");

  const [rfInstance, setRfInstance] = React.useState<ReactFlowInstance | null>(
    null
  );

  useEffect(() => {
    setLastEdgeId("__rendered_" + currentEdge?.id ?? "");
  }, [currentEdge]);

  useEffect(() => {
    setLastNodeId("__rendered_" + currentNode?.id ?? "");
  }, [currentNode]);

  useEffect(() => {
    if (rfInstance) {
    }
  }, [edges, nodes]);

  useEffect(() => {
    if (rfInstance) {
      rfInstance.addNodes([
        {
          type: "projectIdeaSelector",
          id: "node-1",
          position: { x: 0, y: 0 },
          data: roadmap?.projectIdea,
          draggable: false,
          style: {
            backgroundColor: "black",
            borderRadius: "24px",
          },
          deletable: false,
        },
        {
          type: "courseSelector",
          id: "node-2",
          position: { x: 500, y: 0 },
          data: roadmap?.linkedCourses,
          draggable: false,
          style: {
            backgroundColor: "black",
            borderRadius: "24px",
          },
          deletable: false,
        },
        {
          type: "todoSelector",
          id: "node-3",
          position: { x: 1200, y: -300 },
          data: roadmap?.linkedTodos,
          draggable: false,
          style: {
            backgroundColor: "black",
            borderRadius: "24px",
          },
          deletable: false,
        },
        {
          type: "flowSelector",
          id: "node-4",
          position: { x: 1200, y: 300 },
          data: roadmap!.linkedFlows!,
          draggable: false,
          style: {
            backgroundColor: "black",
            borderRadius: "24px",
          },
          deletable: false,
        },
        {
          type: "editorProjectSelector",
          id: "node-5",
          position: { x: 1900, y: 0 },
          data: roadmap?.linkedProject,
          draggable: false,
          style: {
            backgroundColor: "black",
            borderRadius: "24px",
          },
          deletable: false,
        },
      ]);

      rfInstance.addEdges([
        {
          id: "edge-1",
          source: "node-1",
          target: "node-2",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 50,
            height: 50,
          },
        },
        {
          id: "edge-2",
          source: "node-2",
          target: "node-3",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 50,
            height: 50,
          },
        },
        {
          id: "edge-3",
          source: "node-2",
          target: "node-4",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 50,
            height: 50,
          },
        },
        {
          id: "edge-4",
          source: "node-3",
          target: "node-5",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 50,
            height: 50,
          },
        },
        {
          id: "edge-5",
          source: "node-4",
          target: "node-5",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 50,
            height: 50,
          },
        },
      ]);
    }
  }, [roadmap, rfInstance]);

  return (
    <>
      <Head>
        <title>{t("doc.title")}</title>
      </Head>
      {!loggedIn ? (
        <>
          <AuthenticateLoadingIndicator />
        </>
      ) : (
        <>
          {roadmap ? (
            <Box pt={4} bg={"#000"} minH={"100vh"} h={"fit-content"}>
              <Box textAlign={"center"}>
                <CHeading>
                  {t("your.roadmap")}: {roadmap.name}
                </CHeading>
              </Box>
              <Text fontSize={"xl"} textAlign={"center"} mb={6}>
                {t("from.idea.to.project")}
              </Text>
              <Box h={"100vh"} w={"100%"}>
                <ReactFlow
                  nodeTypes={nodeTypes}
                  nodes={nodes}
                  edges={edges}
                  onConnect={onConnect}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  fitView
                  fitViewOptions={{ padding: 0.2 }}
                  snapToGrid={true}
                  snapGrid={[10, 10]}
                  onInit={setRfInstance}
                  onEdgeClick={(e, edge) => {
                    setCurrentEdge(edge);

                    setCurrentNode(null);
                  }}
                  onNodeClick={(e, node) => {
                    setCurrentNode(node);
                    setCurrentEdge(null);
                  }}
                >
                  <Background />
                  <Controls />
                </ReactFlow>
              </Box>
            </Box>
          ) : (
            <>
              <AuthenticateLoadingIndicator text={t("roadmap.loading")} />
            </>
          )}
        </>
      )}
    </>
  );
}
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["roadmap"])),
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
