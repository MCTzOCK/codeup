/**
 * packages/components/editorv2/uml/UMLSeqEditor.tsx
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
  Grid,
  HStack,
  IconButton,
  Input,
  Stack,
} from "@chakra-ui/react";
import { CHeading } from "../../global/CHeading";
import { FaPlus, FaSave, FaTrash } from "react-icons/fa";

export default function UMLSeqEditor(props: {
  uml: IUMLDiagram;
  updateUML: (uml: IUMLDiagram) => void;
}) {
  const [seq, setSeq] = React.useState<
    {
      from: string;
      to: string;
      message: string;
    }[]
  >([]);

  useEffect(() => {
    if (props.uml.data) {
      setSeq(JSON.parse(props.uml.data).seq || []);
    }
  }, [props.uml.data]);

  const updateUML = async () => {
    let content = "@startuml\n";
    content += "title " + props.uml.name + "\n";

    for (const s of seq) {
      content += `${s.from} -> ${s.to}: ${s.message}\n`;
    }

    content += "@enduml";

    props.updateUML({
      ...props.uml,
      data: JSON.stringify({ seq, content }),
    });
  };

  return (
    <>
      <Grid
        templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]}
        gap={4}
      >
        <Box bg={"gray.900"} rounded={"md"} p={4}>
          <CHeading size={"lg"}>Sequenz</CHeading>

          <Stack maxW={"200px"} gap={2}>
            <Button
              variant={"brand"}
              mt={4}
              leftIcon={<FaSave />}
              onClick={async () => {
                await updateUML();
              }}
            >
              Speichern
            </Button>
            <Button
              variant={"brand"}
              mt={4}
              leftIcon={<FaPlus />}
              onClick={() =>
                setSeq([...seq, { from: "", to: "", message: "" }])
              }
            >
              Schritt Hinzufügen
            </Button>
          </Stack>

          <Stack gap={4} mt={4}>
            {seq.map((s, i) => (
              <>
                <HStack>
                  <Input
                    placeholder={"Von"}
                    value={s.from}
                    onChange={(e) => {
                      seq[i].from = e.target.value;
                      setSeq([...seq]);
                    }}
                  />
                  <Input
                    placeholder={"Nach"}
                    value={s.to}
                    onChange={(e) => {
                      seq[i].to = e.target.value;
                      setSeq([...seq]);
                    }}
                  />
                  <Input
                    placeholder={"Nachricht"}
                    value={s.message}
                    onChange={(e) => {
                      seq[i].message = e.target.value;
                      setSeq([...seq]);
                    }}
                  />
                  <IconButton
                    aria-label={"Löschen"}
                    colorScheme={"red"}
                    icon={<FaTrash />}
                    onClick={() => {
                      seq.splice(i, 1);
                      setSeq([...seq]);
                    }}
                  />
                </HStack>
              </>
            ))}
          </Stack>
        </Box>
      </Grid>
    </>
  );
}
