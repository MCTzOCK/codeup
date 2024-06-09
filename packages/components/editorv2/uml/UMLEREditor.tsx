/**
 * packages/components/editorv2/uml/UMLEREditor.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.06.2024
 *
 */

import * as React from "react";
import { IUMLDiagram } from "@codeup/web/src/types/IUMLDiagram";
import { useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  HStack,
  IconButton,
  Input,
  Stack,
} from "@chakra-ui/react";
import { FaPen, FaPlus, FaSave, FaTrash } from "react-icons/fa";
import PopupManager from "@codeup/web/src/global/PopupManager";
import { CHeading } from "../../global/CHeading";
import DividerWithTextV2 from "../../global/DividerWithTextV2";

export default function UMLEREditor(props: {
  uml: IUMLDiagram;
  updateUML: (uml: IUMLDiagram) => void;
}) {
  const [entities, setEntities] = React.useState<
    {
      name: string;
      fields: { name: string; key: boolean }[];
    }[]
  >([]);
  const [relations, setRelations] = React.useState<
    {
      name: string;
      from: string;
      to: string;
      fromRelation: string; // 1, N, M
      toRelation: string; // 1, N, M
      fields: { name: string; key: boolean }[];
    }[]
  >([]);

  const updateUML = async () => {
    let content = "@startchen\n";

    for (const e of entities) {
      content += `entity ${e.name} {\n`;
      for (const f of e.fields) {
        content += `${f.name} ${f.key ? " <<key>>" : ""}\n`;
      }
    }

    for (const r of relations) {
      content += `relationship ${r.name} {\n`;
      for (const f of r.fields) {
        content += `${f.name} ${f.key ? " <<key>>" : ""}\n`;
      }
      content += "}\n";
    }

    for (const r of relations) {
      content += `${r.name} -${r.fromRelation}- ${r.from}\n`;
      content += `${r.name} -${r.toRelation}- ${r.to}\n`;
    }

    content += "@endchen";

    props.updateUML({
      ...props.uml,
      data: JSON.stringify({ entities, relations, content }),
    });
  };

  useEffect(() => {
    if (props.uml.data) {
      const p = JSON.parse(props.uml.data);
      setEntities(p.entities || []);
      setRelations(p.relations || []);
    }
  }, [props.uml.data]);

  return (
    <>
      <Flex gap={4} direction={"column"}>
        <Stack maxW={"200px"} gap={2}>
          <Button
            variant={"brand"}
            onClick={async () => {
              await updateUML();
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
                title: "Entität hinzufügen",
                helperText: "Bitte gib den Namen der Entität ein.",
              });

              if (!name) return;
              if (entities.find((c) => c.name === name)) return;

              setEntities([
                ...entities,
                {
                  name,
                  fields: [],
                },
              ]);
            }}
          >
            Entität hinzufügen
          </Button>
          <Button
            variant={"brand"}
            leftIcon={<FaPlus />}
            w={"100%"}
            onClick={async () => {
              const name = await PopupManager.promptAsync({
                title: "Relation hinzufügen",
                helperText: "Bitte gib den Namen der Relation ein.",
              });

              if (!name) return;

              const from = await PopupManager.selectAsync({
                title: "Von Entität",
                choices: entities.map((e) => e.name),
                helperText:
                  "Bitte wähle die Entität aus, von der die Relation ausgeht.",
              });

              if (!from) return;

              const to = await PopupManager.selectAsync({
                title: "Zu Entität",
                choices: entities.map((e) => e.name),
                helperText:
                  "Bitte wähle die Entität aus, zu der die Relation geht.",
              });

              if (!to) return;

              if (relations.find((c) => c.from === from && c.to === to)) return;

              setRelations([
                ...relations,
                {
                  name,
                  from,
                  to,
                  fromRelation: "1",
                  toRelation: "1",
                  fields: [],
                },
              ]);
            }}
          >
            Relation hinzufügen
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
          {entities.map((e, i) => (
            <>
              <Box bg={"gray.900"} rounded={"md"} p={4}>
                <CHeading size={"md"}>{e.name} (Entität)</CHeading>
                <Flex
                  gap={4}
                  alignItems={"center"}
                  mt={4}
                  mb={4}
                  direction={["column", "column", "row"]}
                >
                  <Button
                    variant={"brand"}
                    leftIcon={<FaPen />}
                    onClick={async () => {
                      const name = await PopupManager.promptAsync({
                        title: "Entität umbenennen",
                        helperText:
                          "Bitte gib den neuen Namen der Entität ein.",
                      });

                      if (!name) return;

                      const newEntities = [...entities];
                      newEntities[i].name = name;
                      setEntities(newEntities);
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
                          title: "Entität löschen",
                          question:
                            "Möchtest du diese Entität wirklich löschen?",
                        }))
                      )
                        return;
                      const newEntities = [...entities];
                      newEntities.splice(i, 1);
                      setEntities(newEntities);
                    }}
                  >
                    Löschen
                  </Button>
                </Flex>
                <DividerWithTextV2 text={"Attribute"} />
                <Button
                  leftIcon={<FaPlus />}
                  variant={"brand"}
                  onClick={async () => {
                    const name = await PopupManager.promptAsync({
                      title: "Attribut hinzufügen",
                      helperText: "Bitte gib den Namen des Attributs ein.",
                    });
                    if (!name) return;
                    const newEntities = [...entities];
                    newEntities[i].fields.push({ name, key: false });
                    setEntities(newEntities);
                  }}
                >
                  Attribut hinzufügen
                </Button>
                <Stack mt={4} mb={4} gap={4}>
                  {e.fields.map((f, j) => (
                    <HStack gap={2}>
                      <Input
                        value={f.name}
                        onChange={(e) => {
                          const newEntities = [...entities];
                          newEntities[i].fields[j].name = e.target.value;
                          setEntities(newEntities);
                        }}
                        placeholder={"Attributname"}
                      />
                      <Checkbox
                        colorScheme={"brand"}
                        checked={f.key}
                        defaultChecked={f.key}
                        onChange={(e) => {
                          const newEntities = [...entities];
                          newEntities[i].fields[j].key = e.target.checked;
                          setEntities(newEntities);
                        }}
                      >
                        Schlüssel
                      </Checkbox>
                      <IconButton
                        aria-label={"Löschen"}
                        icon={<FaTrash />}
                        colorScheme={"red"}
                        onClick={() => {
                          const newEntities = [...entities];
                          newEntities[i].fields.splice(j, 1);
                          setEntities(newEntities);
                        }}
                      />
                    </HStack>
                  ))}
                </Stack>
              </Box>
            </>
          ))}
          {relations.map((r, i) => (
            <>
              <Box bg={"gray.900"} rounded={"md"} p={4}>
                <CHeading size={"md"}>
                  {r.from} [{r.name}] {r.to} (Relation)
                </CHeading>
                <Flex
                  gap={4}
                  alignItems={"center"}
                  mt={4}
                  mb={4}
                  direction={["column", "column", "row"]}
                >
                  <Button
                    variant={"brand"}
                    leftIcon={<FaPen />}
                    onClick={async () => {
                      const name = await PopupManager.promptAsync({
                        title: "Relation umbenennen",
                        helperText:
                          "Bitte gib den neuen Namen der Relation ein.",
                      });

                      if (!name) return;

                      const newRelations = [...relations];
                      newRelations[i].from = name;
                      setRelations(newRelations);
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
                          title: "Relation löschen",
                          question:
                            "Möchtest du diese Relation wirklich löschen?",
                        }))
                      )
                        return;
                      const newRelations = [...relations];
                      newRelations.splice(i, 1);
                      setRelations(newRelations);
                    }}
                  >
                    Löschen
                  </Button>
                </Flex>
                <DividerWithTextV2 text={"Relationsart"} />
                <HStack gap={4}>
                  <Input
                    value={r.fromRelation}
                    onChange={(e) => {
                      const newRelations = [...relations];
                      newRelations[i].fromRelation = e.target.value;
                      setRelations(newRelations);
                    }}
                    placeholder={"Von Relation"}
                  />
                  <Input
                    value={r.toRelation}
                    onChange={(e) => {
                      const newRelations = [...relations];
                      newRelations[i].toRelation = e.target.value;
                      setRelations(newRelations);
                    }}
                    placeholder={"Zu Relation"}
                  />
                </HStack>
                <DividerWithTextV2 text={"Attribute"} />
                <Button
                  leftIcon={<FaPlus />}
                  variant={"brand"}
                  onClick={async () => {
                    const name = await PopupManager.promptAsync({
                      title: "Attribut hinzufügen",
                      helperText: "Bitte gib den Namen des Attributs ein.",
                    });
                    if (!name) return;
                    const newRelations = [...relations];
                    newRelations[i].fields.push({ name, key: false });
                    setRelations(newRelations);
                  }}
                >
                  Attribut hinzufügen
                </Button>
                <Stack mt={4} mb={4} gap={4}>
                  {r.fields.map((f, j) => (
                    <HStack gap={2}>
                      <Input
                        value={f.name}
                        onChange={(e) => {
                          const newRelations = [...relations];
                          newRelations[i].fields[j].name = e.target.value;
                          setRelations(newRelations);
                        }}
                        placeholder={"Attributname"}
                      />
                      <Checkbox
                        colorScheme={"brand"}
                        checked={f.key}
                        defaultChecked={f.key}
                        onChange={(e) => {
                          const newRelations = [...relations];
                          newRelations[i].fields[j].key = e.target.checked;
                          setRelations(newRelations);
                        }}
                      >
                        Schlüssel
                      </Checkbox>
                      <IconButton
                        aria-label={"Löschen"}
                        icon={<FaTrash />}
                        colorScheme={"red"}
                        onClick={() => {
                          const newRelations = [...relations];
                          newRelations[i].fields.splice(j, 1);
                          setRelations(newRelations);
                        }}
                      />
                    </HStack>
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
