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
import { useTranslation } from "next-i18next";

export default function UMLEREditor(props: {
  uml: IUMLDiagram;
  updateUML: (uml: IUMLDiagram) => void;
}) {
  const { t } = useTranslation("projects");
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
            {t("save")}
          </Button>
          <Button
            variant={"brand"}
            leftIcon={<FaPlus />}
            w={"100%"}
            onClick={async () => {
              const name = await PopupManager.promptAsync({
                title: t("uml.er.add.entity"),
                helperText: t("uml.er.add.entity.name"),
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
            {t("uml.er.add.entity")}
          </Button>
          <Button
            variant={"brand"}
            leftIcon={<FaPlus />}
            w={"100%"}
            onClick={async () => {
              const name = await PopupManager.promptAsync({
                title: t("uml.er.add.relation"),
                helperText: t("uml.er.add.relation.name"),
              });

              if (!name) return;

              const from = await PopupManager.selectAsync({
                title: t("uml.er.add.relation.from.entity"),
                choices: entities.map((e) => e.name),
                helperText: t("uml.er.add.relation.from.entity.helper"),
              });

              if (!from) return;

              const to = await PopupManager.selectAsync({
                title: t("uml.er.add.relation.to.entity"),
                choices: entities.map((e) => e.name),
                helperText: t("uml.er.add.relation.to.entity.helper"),
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
            {t("uml.er.add.relation")}
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
                <CHeading size={"md"}>
                  {e.name} ({t("uml.er.entity")})
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
                        title: t("uml.er.rename.entity"),
                        helperText: t("uml.er.rename.entity.name"),
                      });

                      if (!name) return;

                      const newEntities = [...entities];
                      newEntities[i].name = name;
                      setEntities(newEntities);
                    }}
                  >
                    {t("rename")}
                  </Button>
                  <Button
                    colorScheme={"red"}
                    leftIcon={<FaTrash />}
                    onClick={async () => {
                      if (
                        !(await PopupManager.confirmAsync({
                          title: t("uml.er.delete.entity"),
                          question: t("uml.er.delete.entity.confirm"),
                        }))
                      )
                        return;
                      const newEntities = [...entities];
                      newEntities.splice(i, 1);
                      setEntities(newEntities);
                    }}
                  >
                    {t("delete")}
                  </Button>
                </Flex>
                <DividerWithTextV2 text={t("uml.er.attributes")} />
                <Button
                  leftIcon={<FaPlus />}
                  variant={"brand"}
                  onClick={async () => {
                    const name = await PopupManager.promptAsync({
                      title: t("uml.er.add.attribute"),
                      helperText: t("uml.er.add.attribute.name"),
                    });
                    if (!name) return;
                    const newEntities = [...entities];
                    newEntities[i].fields.push({ name, key: false });
                    setEntities(newEntities);
                  }}
                >
                  {t("uml.er.add.attribute")}
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
                        placeholder={t("uml.er.attribute.name")}
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
                        {t("uml.er.attribute.key")}
                      </Checkbox>
                      <IconButton
                        aria-label={t("delete")}
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
                  {r.from} [{r.name}] {r.to} ({t("uml.er.relation")})
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
                        title: t("uml.er.rename.relation"),
                        helperText: t("uml.er.rename.relation.name"),
                      });

                      if (!name) return;

                      const newRelations = [...relations];
                      newRelations[i].from = name;
                      setRelations(newRelations);
                    }}
                  >
                    {t("rename")}
                  </Button>
                  <Button
                    colorScheme={"red"}
                    leftIcon={<FaTrash />}
                    onClick={async () => {
                      if (
                        !(await PopupManager.confirmAsync({
                          title: t("uml.er.delete.relation"),
                          question: t("uml.er.delete.relation.confirm"),
                        }))
                      )
                        return;
                      const newRelations = [...relations];
                      newRelations.splice(i, 1);
                      setRelations(newRelations);
                    }}
                  >
                    {t("delete")}
                  </Button>
                </Flex>
                <DividerWithTextV2 text={t("uml.er.relation.type")} />
                <HStack gap={4}>
                  <Input
                    value={r.fromRelation}
                    onChange={(e) => {
                      const newRelations = [...relations];
                      newRelations[i].fromRelation = e.target.value;
                      setRelations(newRelations);
                    }}
                    placeholder={t("uml.er.relation.type.from")}
                  />
                  <Input
                    value={r.toRelation}
                    onChange={(e) => {
                      const newRelations = [...relations];
                      newRelations[i].toRelation = e.target.value;
                      setRelations(newRelations);
                    }}
                    placeholder={t("uml.er.relation.type.to")}
                  />
                </HStack>
                <DividerWithTextV2 text={t("uml.er.attributes")} />
                <Button
                  leftIcon={<FaPlus />}
                  variant={"brand"}
                  onClick={async () => {
                    const name = await PopupManager.promptAsync({
                      title: t("uml.er.add.attribute"),
                      helperText: t("uml.er.add.attribute.name"),
                    });
                    if (!name) return;
                    const newRelations = [...relations];
                    newRelations[i].fields.push({ name, key: false });
                    setRelations(newRelations);
                  }}
                >
                  {t("uml.er.add.attribute")}
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
                        placeholder={t("uml.er.attribute.name")}
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
                        {t("uml.er.attribute.key")}
                      </Checkbox>
                      <IconButton
                        aria-label={t("delete")}
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
