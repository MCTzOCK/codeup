/**
 * apps/web/src/pages/projects/[id]/flows/[flow_id].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.06.2024
 *
 */

import * as React from "react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import { IProject } from "../../../../types/IProject";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo } from "react";
import REST from "@codeup/rest/src";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../../../global/PopupManager";
import EditorProjectLayout from "@codeup/components/dist/editorv2/EditorProjectLayout";
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  useToast,
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
  Node,
  NodeChange,
  ReactFlowInstance,
} from "reactflow";
import { FaPlus, FaTrash } from "react-icons/fa";
import IssueNode from "@codeup/components/projectflows/IssueNode";
import { VscIssues } from "react-icons/vsc";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { sProp } from "../../../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import Head from "next/head";

export default function ProjectFlowViewer() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const { t } = useTranslation("flows");

  const nodeTypes = useMemo(
    () => ({
      issue: IssueNode,
    }),
    []
  );

  const [project, setProject] = React.useState<IProject | null>(null);
  const [flow, setFlow] = React.useState<any>();

  const router = useRouter();

  useEffect(() => {
    if (!router || !router.query || !router.query.id) return;

    REST.Projects.project(
      AccountManager.getActiveToken(),
      router.query.id as string
    ).then(async (res) => {
      if (res.status === 200) {
        setProject(res.payload.project);
        reloadFlow();
      } else {
        PopupManager.alertAsync({
          title: t("base:control.error"),
          description:
            t("projects:project.loading.error") + ": " + res.payload.error,
        });
      }
    });
  }, [router, router.query, router.query.id]);

  const reloadFlow = async () => {
    const res = await REST.Projects.getFlows(
      AccountManager.getActiveToken(),
      router.query.id as string,
      router.query.flow_id as string
    );

    if (res.status !== 200) {
      await PopupManager.alertAsync({
        title: t("base:control.error"),
        description:
          t("projects:loading.flow.error") + ": " + res.payload.error,
      });
      return;
    }

    let nodesX = [];
    let edgesX = [];

    let x: any = {};

    if (res.payload.flow.saved && res.payload.flow.saved !== "") {
      x = JSON.parse(res.payload.flow.saved);
    }

    if (!x.nodes) {
      x.nodes = [];
    }

    if (!x.edges) {
      x.edges = [];
    }

    nodesX = x.nodes;
    edgesX = x.edges;

    setNodes(nodesX);
    setEdges(edgesX);

    setFlow(res.payload.flow);
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

  const toast = useToast();

  useEffect(() => {
    setLastEdgeId("__rendered_" + currentEdge?.id ?? "");
  }, [currentEdge]);

  useEffect(() => {
    setLastNodeId("__rendered_" + currentNode?.id ?? "");
  }, [currentNode]);

  useEffect(() => {
    if (rfInstance) {
      const saved = rfInstance.toObject();

      REST.Projects.updateFlow(
        AccountManager.getActiveToken(),
        router.query.id as string,
        router.query.flow_id as string,
        flow.name,
        JSON.stringify(saved)
      );
    }
  }, [edges, nodes]);

  return (
    <>
      <Head>
        <title>{t("projects:flow.doc.title")}</title>
      </Head>
      <EditorProjectLayout project_id={router.query.id as string}>
        <Flex
          maxH={"95vh"}
          h={"95vh"}
          p={"4rem"}
          paddingBottom={"8rem"}
          paddingTop={"0"}
          alignItems={"center"}
          justifyContent={"center"}
          pt={"2rem"}
          bg={"#000"}
          gap={6}
        >
          <Box h={"100%"} w={"100%"} flex={"80%"}>
            <ReactFlow
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
                if (node.type !== "issue") {
                  setCurrentNode(node);
                  setCurrentEdge(null);
                }
              }}
              nodeTypes={nodeTypes}
            >
              <Background />
              <Controls />
            </ReactFlow>
          </Box>
          <Box flex={"20%"} maxH={"100%"} h={"100%"} overflow={"auto"}>
            <Stack gap={6}>
              <Heading textAlign="center" size={"xl"}>
                {currentEdge !== null
                  ? t("edge")
                  : currentNode !== null
                  ? t("node")
                  : ""}
              </Heading>
              <ButtonGroup w={"100%"}>
                <Button
                  w={"100%"}
                  variant={"brand"}
                  leftIcon={<FaPlus />}
                  onClick={() => {
                    const randomNumber = (min: number, max: number) => {
                      return Math.floor(Math.random() * (max - min + 1)) + min;
                    };

                    setNodes((nodes) => [
                      ...nodes,
                      {
                        id: `${nodes.length + 1}`,
                        data: { label: t("nodes.default.new") },
                        position: {
                          x: randomNumber(0, 400),
                          y: randomNumber(0, 400),
                        },
                        style: {
                          background: "#141517",
                          color: "#F7DE1F",
                          borderRadius: "0.75rem",
                        },
                        deletable: false,
                      },
                    ]);
                  }}
                >
                  {t("nodes.default.new")}
                </Button>
              </ButtonGroup>
              <Button
                variant={"brand"}
                leftIcon={<VscIssues />}
                onClick={async () => {
                  const issues = (
                    await REST.Projects.getIssues(
                      AccountManager.getActiveToken(),
                      router.query.id as string
                    )
                  ).payload.issues;

                  await PopupManager.alertAsync({
                    title: t("projects:flows.add.issue"),
                    description: (
                      <>
                        <Stack gap={4}>
                          {issues.map((issue: any) => (
                            <>
                              <Box
                                p={4}
                                rounded={"md"}
                                bg={"gray.900"}
                                cursor={"pointer"}
                                onClick={() => {
                                  const randomNumber = (
                                    min: number,
                                    max: number
                                  ) => {
                                    return (
                                      Math.floor(
                                        Math.random() * (max - min + 1)
                                      ) + min
                                    );
                                  };

                                  setNodes((nodes) => [
                                    ...nodes,
                                    {
                                      id: `${nodes.length + 1}`,
                                      data: [project?._id, issue._id],
                                      position: {
                                        x: randomNumber(0, 400),
                                        y: randomNumber(0, 400),
                                      },
                                      style: {
                                        background: "transparent",
                                        color: "white",
                                      },
                                      type: "issue",
                                    },
                                  ]);

                                  PopupManager.removeCurrentPopup();
                                }}
                              >
                                <CHeading size={"lg"}>{issue.title}</CHeading>
                                <Text>
                                  {issue.status === "open"
                                    ? t("projects:flows.issue.open")
                                    : t("projects:flows.issue.closed")}
                                </Text>
                                <Text>{issue.description}</Text>
                              </Box>
                            </>
                          ))}
                        </Stack>
                      </>
                    ),
                  });
                }}
              >
                {t("projects:flows.add.issue")}
              </Button>

              {currentEdge !== null &&
                lastEdgeId === "__rendered_" + currentEdge.id && (
                  <Stack gap={5}>
                    <Divider />
                    <Flex w={"100%"} justifyContent={"space-between"}>
                      <Heading size={"lg"}>ID</Heading>
                      <Heading size={"lg"} fontWeight={"none"}>
                        {currentEdge.id}
                      </Heading>
                    </Flex>
                    <Flex w={"100%"} justifyContent={"space-between"}>
                      <Heading size={"lg"} flex={"50%"}>
                        {t("edges.animated")}
                      </Heading>
                      <Select
                        flex={"50%"}
                        onChange={(e) => {
                          setEdges(
                            edges.map((edge) => {
                              if (edge.id === currentEdge?.id) {
                                edge.animated = e.target.value === "true";
                              }
                              return edge;
                            })
                          );
                        }}
                        fontSize={"xl"}
                      >
                        <option value={"true"} selected={currentEdge.animated}>
                          {t("yes")}
                        </option>
                        <option
                          value={"false"}
                          selected={!currentEdge.animated}
                        >
                          {t("no")}
                        </option>
                      </Select>
                    </Flex>
                    <Flex w={"100%"} justifyContent={"space-between"}>
                      <Heading size={"lg"} flex={"50%"}>
                        {t("text")}
                      </Heading>
                      <Input
                        flex={"50%"}
                        defaultValue={currentEdge.label as string}
                        onChange={(e) => {
                          setEdges(
                            edges.map((edge) => {
                              if (edge.id === currentEdge?.id) {
                                edge.label = e.target.value;
                              }
                              return edge;
                            })
                          );
                        }}
                      />
                    </Flex>
                    <Flex w={"100%"} justifyContent={"space-between"}>
                      <Heading size={"lg"} flex={"50%"}>
                        {t("type")}
                      </Heading>
                      <Select
                        flex={"50%"}
                        onChange={(e) => {
                          setEdges(
                            edges.map((edge) => {
                              if (edge.id === currentEdge?.id) {
                                edge.type = e.target.value as string;
                              }
                              return edge;
                            })
                          );
                        }}
                        fontSize={"xl"}
                      >
                        <option
                          value={"default"}
                          selected={currentEdge.type === "default"}
                        >
                          {t("default")}
                        </option>
                        <option
                          value={"smoothstep"}
                          selected={currentEdge.type === "smoothstep"}
                        >
                          {t("step")}
                        </option>
                      </Select>
                    </Flex>
                    <ButtonGroup w={"100%"}>
                      <Button
                        w={"100%"}
                        colorScheme={"red"}
                        leftIcon={<FaTrash />}
                        onClick={() => {
                          setCurrentEdge(null);
                          setEdges(
                            edges.filter((edge) => edge.id !== currentEdge?.id)
                          );
                        }}
                      >
                        {t("delete")}
                      </Button>
                    </ButtonGroup>
                  </Stack>
                )}
              {currentNode !== null &&
                lastNodeId === "__rendered_" + currentNode.id && (
                  <Stack gap={5}>
                    <Divider />
                    <Flex w={"100%"} justifyContent={"space-between"}>
                      <Heading size={"lg"}>ID</Heading>
                      <Heading size={"lg"} fontWeight={"none"}>
                        {currentNode.id}
                      </Heading>
                    </Flex>
                    <Flex w={"100%"} justifyContent={"space-between"}>
                      <Heading size={"lg"} flex={"50%"}>
                        {t("text")}
                      </Heading>
                      <Input
                        fontSize={"xl"}
                        flex={"50%"}
                        defaultValue={currentNode.data.label as string}
                        onChange={(e) => {
                          setNodes(
                            nodes.map((node) => {
                              if (node.id === currentNode?.id) {
                                node.data.label = e.target.value;
                              }
                              return node;
                            })
                          );
                        }}
                      />
                    </Flex>
                    <Flex w={"100%"} justifyContent={"space-between"}>
                      <Heading size={"lg"} flex={"50%"}>
                        {t("type")}
                      </Heading>
                      <Select
                        flex={"50%"}
                        onChange={(e) => {
                          setNodes(
                            nodes.map((node) => {
                              if (node.id === currentNode?.id) {
                                node.type = e.target.value as string;
                              }
                              return node;
                            })
                          );
                        }}
                        fontSize={"xl"}
                      >
                        <option
                          value={"default"}
                          selected={currentNode.type === "default"}
                        >
                          {t("default")}
                        </option>
                        <option
                          value={"input"}
                          selected={currentNode.type === "input"}
                        >
                          {t("input")}
                        </option>
                        <option
                          value={"output"}
                          selected={currentNode.type === "output"}
                        >
                          {t("output")}
                        </option>
                      </Select>
                    </Flex>
                    <Flex w={"100%"} justifyContent={"space-between"}>
                      <Heading size={"lg"} flex={"50%"}>
                        {t("color")}
                      </Heading>
                      <Input
                        flex={"50%"}
                        type={"color"}
                        defaultValue={
                          // @ts-ignore
                          currentNode.style.background as string
                        }
                        onChange={(e) => {
                          setNodes(
                            nodes.map((node) => {
                              if (node.id === currentNode?.id) {
                                // @ts-ignore
                                node.style.background = e.target.value;
                              }
                              return node;
                            })
                          );
                        }}
                      />
                    </Flex>

                    <ButtonGroup w={"100%"}>
                      <Button
                        w={"100%"}
                        colorScheme={"red"}
                        onClick={() => {
                          setCurrentNode(null);
                          setNodes(
                            nodes.filter((node) => node.id !== currentNode?.id)
                          );
                        }}
                      >
                        {t("delete")}
                      </Button>
                    </ButtonGroup>
                  </Stack>
                )}
            </Stack>
          </Box>
        </Flex>
      </EditorProjectLayout>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["projects", "flows"])),
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
