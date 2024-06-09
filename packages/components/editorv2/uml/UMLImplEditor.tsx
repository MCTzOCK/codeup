/**
 * packages/components/editorv2/uml/UMLImplEditor.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.06.2024
 *
 */

import * as React from "react";
import { IUMLDiagram } from "@codeup/web/src/types/IUMLDiagram";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  HStack,
  IconButton,
  Input,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaPen, FaPlus, FaSave, FaTrash } from "react-icons/fa";
import PopupManager from "@codeup/web/src/global/PopupManager";
import { CHeading } from "../../global/CHeading";
import DividerWithText from "../../global/DividerWithText";
import DividerWithTextV2 from "../../global/DividerWithTextV2";

export default function UMLImplEditor(props: {
  uml: IUMLDiagram;
  updateUML: (uml: IUMLDiagram) => void;
}) {
  const [classes, setClasses] = useState<
    {
      name: string;
      extends: string;
      type: "class" | "interface" | "abstract class";
      fields: {
        name: string;
        type: string;
        visibility: "public" | "private" | "protected";
      }[];
      methods: {
        name: string;
        returnType: string;
        visibility: "public" | "private" | "protected";
        args: {
          name: string;
          type: string;
        }[];
      }[];
    }[]
  >([]);

  useEffect(() => {
    if (props.uml.data) {
      setClasses(JSON.parse(props.uml.data).classes || []);
    }
  }, [props.uml.data]);

  return (
    <>
      <Flex gap={4} direction={"column"}>
        <Stack maxW={"200px"} gap={2}>
          <Button
            variant={"brand"}
            onClick={async () => {
              props.updateUML({
                ...props.uml,
                data: JSON.stringify({ classes }),
              });
            }}
            w={"100%"}
            leftIcon={<FaSave />}
          >
            Speichern
          </Button>
          <Button
            variant={"brand"}
            leftIcon={<FaPlus />}
            w={"100%"}
            onClick={async () => {
              const name = await PopupManager.promptAsync({
                title: "Klasse hinzufügen",
                helperText: "Bitte gib den Namen der Klasse ein.",
              });

              if (!name) return;
              if (classes.find((c) => c.name === name)) return;

              setClasses([
                ...classes,
                {
                  name: name,
                  extends: "",
                  type: "class",
                  fields: [],
                  methods: [],
                },
              ]);
            }}
          >
            Klasse hinzufügen
          </Button>
        </Stack>
        <Grid
          templateColumns={[
            "repeat(1, 1fr)",
            "repeat(2, 1fr)",
            "repeat(3, 1fr)",
          ]}
          gap={4}
        >
          {classes.map((c, i) => (
            <>
              <Box bg={"gray.900"} rounded={"md"} p={4}>
                <CHeading size={"md"}>{c.name}</CHeading>
                <Flex gap={4} alignItems={"center"} mt={4} mb={4}>
                  <Button
                    variant={"brand"}
                    leftIcon={<FaPen />}
                    onClick={async () => {
                      const name = await PopupManager.promptAsync({
                        title: "Klasse umbenennen",
                        helperText: "Bitte gib den neuen Namen der Klasse ein.",
                      });

                      if (!name) return;

                      const newClasses = [...classes];
                      newClasses[i].name = name;
                      setClasses(newClasses);
                    }}
                  >
                    Umbenennen
                  </Button>
                  <Button
                    colorScheme={"red"}
                    leftIcon={<FaTrash />}
                    onClick={async () => {
                      if (
                        !(await PopupManager.confirmAsync({
                          title: "Klasse löschen",
                          question:
                            "Möchtest du diese Klasse wirklich löschen?",
                        }))
                      )
                        return;
                      const newClasses = [...classes];
                      newClasses.splice(i, 1);
                      setClasses(newClasses);
                    }}
                  >
                    Löschen
                  </Button>
                </Flex>
                <CHeading size={"sm"}>Attribute</CHeading>
                <Flex gap={4} alignItems={"center"} mt={4} mb={4}>
                  <Button
                    variant={"brand"}
                    leftIcon={<FaPlus />}
                    onClick={async () => {
                      const name = await PopupManager.promptAsync({
                        title: "Attribut hinzufügen",
                        helperText: "Bitte gib den Namen des Attributs ein.",
                      });

                      if (!name) return;

                      const newClasses = [...classes];
                      newClasses[i].fields.push({
                        name: name,
                        type: "String",
                        visibility: "public",
                      });
                      setClasses(newClasses);
                    }}
                  >
                    Attribut hinzufügen
                  </Button>
                  <Button
                    variant={"brand"}
                    leftIcon={<FaPlus />}
                    onClick={async () => {
                      const name = await PopupManager.promptAsync({
                        title: "Bezugsobjekt hinzufügen",
                        helperText:
                          "Bitte gib den Namen des Bezugsobjekts ein.",
                      });

                      if (!name) return;

                      const c = await PopupManager.selectAsync({
                        title: "Klasse auswählen",
                        helperText:
                          "Wähle die Klasse aus, die referenziert werden soll.",
                        choices: classes.map((c) => c.name),
                      });

                      if (!c) return;

                      const newClasses = [...classes];
                      newClasses[i].fields.push({
                        name: name,
                        type: c,
                        visibility: "public",
                      });
                      setClasses(newClasses);
                    }}
                  >
                    Bezugsobjekt hinzufügen
                  </Button>
                </Flex>
                <Stack mt={4} mb={4} gap={4}>
                  {c.fields.map((f) => (
                    <HStack>
                      <Input
                        value={f.name}
                        onChange={(e) => {
                          const newClasses = [...classes];
                          newClasses[i].fields[
                            newClasses[i].fields.indexOf(f)
                          ].name = e.target.value;
                          setClasses(newClasses);
                        }}
                        placeholder={"Name"}
                      />
                      <Input
                        value={f.type}
                        onChange={(e) => {
                          const newClasses = [...classes];
                          newClasses[i].fields[
                            newClasses[i].fields.indexOf(f)
                          ].type = e.target.value;
                          setClasses(newClasses);
                        }}
                        placeholder={"String"}
                      />
                      <Select
                        value={f.visibility}
                        onChange={(e) => {
                          const newClasses = [...classes];
                          newClasses[i].fields[
                            newClasses[i].fields.indexOf(f)
                          ].visibility = e.target.value as any;
                          setClasses(newClasses);
                        }}
                      >
                        <option value={"public"}>public</option>
                        <option value={"private"}>private</option>
                        <option value={"protected"}>protected</option>
                      </Select>
                      <IconButton
                        aria-label={"Löschen"}
                        icon={<FaTrash />}
                        colorScheme={"red"}
                        onClick={() => {
                          const newClasses = [...classes];
                          newClasses[i].fields.splice(
                            newClasses[i].fields.indexOf(f),
                            1
                          );
                          setClasses(newClasses);
                        }}
                      />
                    </HStack>
                  ))}
                </Stack>
                <CHeading size={"sm"}>Methoden</CHeading>
                <Flex gap={4} alignItems={"center"} mt={4} mb={4}>
                  <Button
                    variant={"brand"}
                    leftIcon={<FaPlus />}
                    onClick={async () => {
                      const name = await PopupManager.promptAsync({
                        title: "Methode hinzufügen",
                        helperText: "Bitte gib den Namen der Methode ein.",
                      });

                      if (!name) return;

                      const newClasses = [...classes];

                      newClasses[i].methods.push({
                        name: name,
                        returnType: "void",
                        visibility: "public",
                        args: [],
                      });

                      setClasses(newClasses);
                    }}
                  >
                    Methode hinzufügen
                  </Button>
                </Flex>
                <Stack mt={4} mb={4} gap={4}>
                  {c.methods.map((m) => (
                    <>
                      <DividerWithTextV2 text={m.name + "()"} />
                      <HStack>
                        <Input
                          value={m.name}
                          onChange={(e) => {
                            const newClasses = [...classes];
                            newClasses[i].methods[
                              newClasses[i].methods.indexOf(m)
                            ].name = e.target.value;
                            setClasses(newClasses);
                          }}
                          placeholder={"Name"}
                        />
                        <Input
                          value={m.returnType}
                          onChange={(e) => {
                            const newClasses = [...classes];
                            newClasses[i].methods[
                              newClasses[i].methods.indexOf(m)
                            ].returnType = e.target.value;
                            setClasses(newClasses);
                          }}
                          placeholder={"void"}
                        />
                        <Select
                          value={m.visibility}
                          onChange={(e) => {
                            const newClasses = [...classes];
                            newClasses[i].methods[
                              newClasses[i].methods.indexOf(m)
                            ].visibility = e.target.value as any;
                            setClasses(newClasses);
                          }}
                        >
                          <option value={"public"}>public</option>
                          <option value={"private"}>private</option>
                          <option value={"protected"}>protected</option>
                        </Select>
                        <IconButton
                          aria-label={"Löschen"}
                          icon={<FaTrash />}
                          colorScheme={"red"}
                          onClick={() => {
                            const newClasses = [...classes];
                            newClasses[i].methods.splice(
                              newClasses[i].methods.indexOf(m),
                              1
                            );
                            setClasses(newClasses);
                          }}
                        />
                        <IconButton
                          aria-label={"Argument hinzufügen"}
                          icon={<FaPlus />}
                          variant={"brand"}
                          onClick={async () => {
                            const name = await PopupManager.promptAsync({
                              title: "Argument hinzufügen",
                              helperText:
                                "Bitte gib den Namen des Arguments ein.",
                            });

                            if (!name) return;

                            const newClasses = [...classes];
                            newClasses[i].methods[
                              newClasses[i].methods.indexOf(m)
                            ].args.push({
                              name: name,
                              type: "String",
                            });
                            setClasses(newClasses);
                          }}
                        />
                      </HStack>
                      <DividerWithTextV2
                        text={"Argumente"}
                        color={"gray.300"}
                      />
                      <Stack mt={4} mb={4} gap={4}>
                        {m.args.map((a) => (
                          <HStack>
                            <Input
                              value={a.name}
                              onChange={(e) => {
                                const newClasses = [...classes];
                                newClasses[i].methods[
                                  newClasses[i].methods.indexOf(m)
                                ].args[
                                  newClasses[i].methods[
                                    newClasses[i].methods.indexOf(m)
                                  ].args.indexOf(a)
                                ].name = e.target.value;
                                setClasses(newClasses);
                              }}
                              placeholder={"Name"}
                            />
                            <Input
                              value={a.type}
                              onChange={(e) => {
                                const newClasses = [...classes];
                                newClasses[i].methods[
                                  newClasses[i].methods.indexOf(m)
                                ].args[
                                  newClasses[i].methods[
                                    newClasses[i].methods.indexOf(m)
                                  ].args.indexOf(a)
                                ].type = e.target.value;
                                setClasses(newClasses);
                              }}
                              placeholder={"String"}
                            />
                            <IconButton
                              aria-label={"Löschen"}
                              icon={<FaTrash />}
                              colorScheme={"red"}
                              onClick={() => {
                                const newClasses = [...classes];
                                newClasses[i].methods[
                                  newClasses[i].methods.indexOf(m)
                                ].args.splice(
                                  newClasses[i].methods[
                                    newClasses[i].methods.indexOf(m)
                                  ].args.indexOf(a),
                                  1
                                );
                                setClasses(newClasses);
                              }}
                            />
                          </HStack>
                        ))}
                      </Stack>
                    </>
                  ))}
                </Stack>
              </Box>
            </>
          ))}
        </Grid>
      </Flex>
    </>
  );
}
