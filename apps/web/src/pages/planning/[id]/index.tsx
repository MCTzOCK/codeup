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
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";

export default function Index() {
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
      const saved = rfInstance.toObject();
      console.log(saved);
    }
  }, [edges, nodes]);

  useEffect(() => {
    const savedNodes: Node[] = [
      {
        data: {
          label: "Saved Node",
        },
        deletable: false,
        dragging: false,
        height: 40,
        id: "1",
        position: {
          x: 296,
          y: 113,
        },
        positionAbsolute: {
          x: 296,
          y: 113,
        },
        selectable: false,
        style: { background: "#4422FF", color: "white" },
        width: 150,
      },
    ];
    const savedEdges: Edge[] = [];

    setTimeout(() => {
      setNodes(savedNodes);
      setEdges(savedEdges);
    }, 2000);
  }, []);

  return (
    <>
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
            <MiniMap />
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
                : "Inspektor"}
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
