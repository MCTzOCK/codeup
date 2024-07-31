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
import { useTranslation } from "next-i18next";

export default function DBTableCreator(props: {
  callback: (name: string, columns: { name: string; type: string }[]) => void;
}) {
  const { t } = useTranslation("projects");

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
            <FormLabel>{t("name")}</FormLabel>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder={t("name")}
            />
            <FormHelperText>{t("db.table.name.of")}</FormHelperText>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>{t("db.table.columns")}</FormLabel>
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
                  placeholder={t("name")}
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
                  placeholder={t("type")}
                >
                  <option value={"int"}>Integer</option>
                  <option value={"decimal"}>Decimal</option>
                  <option value={"text"}>Text</option>
                  <option value={"date"}>Date</option>
                </Select>
                <IconButton
                  aria-label={t("delete")}
                  icon={<FaTrash />}
                  colorScheme={"red"}
                  onClick={() => {
                    setColumns(columns.filter((c, i) => i !== index));
                  }}
                />
              </Stack>
            ))}
            <FormHelperText>{t("db.tables.columns.of")}</FormHelperText>
          </FormControl>
          <Button
            variant={"brand"}
            onClick={() => {
              setColumns([...columns, { name: "", type: "" }]);
            }}
            leftIcon={<FaPlus />}
          >
            {t("db.tables.columns.add")}
          </Button>
          <Button type={"submit"} variant={"brand"}>
            {t("create")}
          </Button>
        </Stack>
      </form>
    </>
  );
}
