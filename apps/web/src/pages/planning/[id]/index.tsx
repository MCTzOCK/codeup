/**
 * apps/web/src/pages/planning/[id]/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.12.2022
 *
 */

import * as React from "react";
import { useCallback, useEffect } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  MarkerType,
  MiniMap,
  Node,
  NodeChange,
  ReactFlowInstance,
} from "reactflow";
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
  useToast,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import REST from "@codeup/rest";
import { useRouter } from "next/router";
import { useLoggedIn } from "@codeup/hooks";
import Head from "next/head";

export default function Index() {
  const { userInfo, loggedIn, loaded } = useLoggedIn();

  const router = useRouter();

  useEffect(() => {
    if (!loggedIn && loaded) {
      router.push("/");
      window.dispatchEvent(new CustomEvent("codeup::open_login"));
    }
  }, [userInfo, loggedIn, loaded]);

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

      REST.ToDo.updateV2Project({
        token: localStorage.getItem("token") as string,
        id: router.query.id as string,
        saved: JSON.stringify(saved),
      });
    }
  }, [edges, nodes]);

  useEffect(() => {
    const savedNodes: Node[] = [];
    const savedEdges: Edge[] = [];

    REST.ToDo.getV2Project({
      token: localStorage.getItem("token") as string,
      id: router.query.id as string,
    }).then((res) => {
      if (res.status === 200) {
        let p = res.payload.projects[0];
        if (!p.saved || p.saved === "") {
          savedNodes.push({
            id: `1`,
            data: { label: "Hauptknoten" },
            position: {
              x: 100,
              y: 100,
            },
            style: {
              background: "#4422FF",
              color: "white",
            },
            deletable: false,
          });
        } else {
          const saved = JSON.parse(p.saved);
          savedNodes.push(...saved.nodes);
          savedEdges.push(...saved.edges);
        }

        setNodes(savedNodes);
        setEdges(savedEdges);
      } else {
        toast({
          title: "Fehler",
          description:
            "Beim Laden des Projekts ist ein Fehler aufgetreten: " +
            res.payload.message,
          status: "error",
          duration: 1500,
          isClosable: true,
          position: "bottom-right",
        });
      }
    });
  }, [router.query.id]);

  return (
    <>
      <Head>
        <title>Projektplanung - CodeUp</title>
      </Head>
      <Flex
        maxH={"100vh"}
        h={"100vh"}
        p={"4rem"}
        paddingBottom={"8rem"}
        paddingTop={"0"}
        alignItems={"center"}
        justifyContent={"center"}
        mt={"2rem"}
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
              setCurrentNode(node);
              setCurrentEdge(null);
            }}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </Box>
        <Box flex={"20%"} maxH={"100%"} h={"100%"} overflow={"auto"}>
          <Stack gap={6}>
            <Heading textAlign="center" size={"xl"}>
              {currentEdge !== null
                ? "Verbindung"
                : currentNode !== null
                ? "Knoten"
                : ""}
            </Heading>
            <ButtonGroup w={"100%"}>
              <Button
                w={"100%"}
                colorScheme={"green"}
                leftIcon={<FaPlus />}
                onClick={() => {
                  const randomNumber = (min: number, max: number) => {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                  };

                  setNodes((nodes) => [
                    ...nodes,
                    {
                      id: `${nodes.length + 1}`,
                      data: { label: "Neuer Knoten" },
                      position: {
                        x: randomNumber(0, 400),
                        y: randomNumber(0, 400),
                      },
                      style: {
                        background: "#4422FF",
                        color: "white",
                      },
                      deletable: false,
                    },
                  ]);
                }}
              >
                Neuer Knoten
              </Button>
            </ButtonGroup>

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
                      Animiert
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
                        Ja
                      </option>
                      <option value={"false"} selected={!currentEdge.animated}>
                        Nein
                      </option>
                    </Select>
                  </Flex>
                  <Flex w={"100%"} justifyContent={"space-between"}>
                    <Heading size={"lg"} flex={"50%"}>
                      Text
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
                      Typ
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
                        Standard
                      </option>
                      <option
                        value={"smoothstep"}
                        selected={currentEdge.type === "smoothstep"}
                      >
                        Schritt
                      </option>
                    </Select>
                  </Flex>
                  <ButtonGroup w={"100%"}>
                    <Button
                      w={"100%"}
                      colorScheme={"red"}
                      onClick={() => {
                        setCurrentEdge(null);
                        setEdges(
                          edges.filter((edge) => edge.id !== currentEdge?.id)
                        );
                      }}
                    >
                      Löschen
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
                      Text
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
                      Typ
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
                        Standard
                      </option>
                      <option
                        value={"input"}
                        selected={currentNode.type === "input"}
                      >
                        Eingang
                      </option>
                      <option
                        value={"output"}
                        selected={currentNode.type === "output"}
                      >
                        Ausgang
                      </option>
                    </Select>
                  </Flex>
                  <Flex w={"100%"} justifyContent={"space-between"}>
                    <Heading size={"lg"} flex={"50%"}>
                      Farbe
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
                      Löschen
                    </Button>
                  </ButtonGroup>
                </Stack>
              )}
          </Stack>
        </Box>
      </Flex>
    </>
  );
}
