/**
 * packages/components/editorv2/db/DBTableCreator.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.06.2024
 *
 */

import * as React from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Select,
  Stack,
} from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";
import PopupManager from "@codeup/web/src/global/PopupManager";

export default function DBTableCreator(props: {
  callback: (name: string, columns: { name: string; type: string }[]) => void;
}) {
  const [columns, setColumns] = React.useState<
    { name: string; type: string }[]
  >([]);
  const [name, setName] = React.useState<string>("");

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          props.callback(name, [
            {
              name: "ID",
              type: "INT NOT NULL AUTO_INCREMENT",
            },
            ...columns,
          ]);
          PopupManager.removeCurrentPopup();
        }}
      >
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder={"Name"}
            />
            <FormHelperText>Der Name der Tabelle</FormHelperText>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Spalten</FormLabel>
            <Stack spacing={4} direction={"row"} p={2}>
              <Input value={"ID"} isDisabled />
              <Input value={"INT NOT NULL AUTO_INCREMENT"} isDisabled />
            </Stack>
            {columns.map((col, index) => (
              <Stack key={index} spacing={4} direction={"row"} p={2}>
                <Input
                  value={col.name}
                  onChange={(e) => {
                    setColumns(
                      columns.map((c, i) =>
                        i === index ? { ...c, name: e.target.value } : c
                      )
                    );
                  }}
                  placeholder={"Name"}
                />
                <Select
                  value={col.type}
                  onChange={(e) => {
                    setColumns(
                      columns.map((c, i) =>
                        i === index ? { ...c, type: e.target.value } : c
                      )
                    );
                  }}
                  placeholder={"Type"}
                >
                  <option value={"int"}>Integer</option>
                  <option value={"decimal"}>Decimal</option>
                  <option value={"text"}>Text</option>
                  <option value={"date"}>Date</option>
                </Select>
                <IconButton
                  aria-label={"Löschen"}
                  icon={<FaTrash />}
                  colorScheme={"red"}
                  onClick={() => {
                    setColumns(columns.filter((c, i) => i !== index));
                  }}
                />
              </Stack>
            ))}
            <FormHelperText>Die Spalten der Tabelle</FormHelperText>
          </FormControl>
          <Button
            variant={"brand"}
            onClick={() => {
              setColumns([...columns, { name: "", type: "" }]);
            }}
            leftIcon={<FaPlus />}
          >
            Spalte hinzufügen
          </Button>
          <Button type={"submit"} variant={"brand"}>
            Erstellen
          </Button>
        </Stack>
      </form>
    </>
  );
}
