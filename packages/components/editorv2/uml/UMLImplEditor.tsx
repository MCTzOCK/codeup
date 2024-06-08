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
  Flex,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaPen, FaPlus, FaSave, FaTrash } from "react-icons/fa";
import PopupManager from "@codeup/web/src/global/PopupManager";

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
        <Accordion allowToggle allowMultiple>
          {classes.map((c, i) => (
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as={"span"} flex={1} textAlign={"left"}>
                    {c.name}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Stack spacing={4}>
                  <Flex
                    alignItems={"center"}
                    direction={["column", "column", "row"]}
                    gap={4}
                  >
                    <Button
                      variant={"brand"}
                      onClick={async () => {
                        const name = await PopupManager.promptAsync({
                          title: "Klasse umbenennen",
                          helperText:
                            "Bitte gib den neuen Namen der Klasse ein.",
                        });

                        if (!name) return;
                        if (classes.find((c) => c.name === name)) return;

                        let newClasses = classes;

                        newClasses = newClasses.map((c5, index) => {
                          if (c5.name === c.name) {
                            c5.name = name;
                          }
                          return c5;
                        });
                        setClasses(newClasses);
                      }}
                      leftIcon={<FaPen />}
                    >
                      Umbenennen
                    </Button>
                    <Button
                      colorScheme={"red"}
                      leftIcon={<FaTrash />}
                      onClick={() => {
                        setClasses(
                          classes.filter((c2, index) => c2.name !== c.name)
                        );
                      }}
                    >
                      Löschen
                    </Button>
                  </Flex>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Flex>
    </>
  );
}
