/**
 * packages/components/editorv2/db/SQLExecutor.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.06.2024
 *
 */

import * as React from "react";
import {
  Modal,
  ModalContent,
  ModalOverlay,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  Button,
  HStack,
  Tfoot,
  TableCaption,
} from "@chakra-ui/react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import { CHeading } from "../../global/CHeading";
import { FaPlay } from "react-icons/fa6";
import { useTranslation } from "next-i18next";

export default function SQLExecutor(props: {
  projectId: string;
  base_sql?: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation("projects");

  const [sql, setSql] = React.useState<string>(props.base_sql || "");
  const [result, setResult] = React.useState<any[]>([]);
  const [tSql, setTSql] = React.useState<string>("");

  React.useEffect(() => {
    executeSql(sql);
    setTSql(sql);
  }, [sql]);

  React.useEffect(() => {
    setSql(props.base_sql || "");
  }, [props.base_sql]);

  const executeSql = async (q: string) => {
    const res = await REST.Projects.DB.executeSQL(
      AccountManager.getActiveToken(),
      props.projectId,
      q
    );

    if (res.status === 200) {
      setResult(res.payload.data);
      console.log(res.payload.data);
    }
  };

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose} size={"full"}>
        <ModalOverlay>
          <ModalContent bg={"#000"}>
            <ModalHeader>
              <CHeading size={"lg"}>{t("db.run.sql.query")}</CHeading>
              <ModalCloseButton />
            </ModalHeader>
            <ModalBody p={4}>
              <HStack>
                <Input
                  defaultValue={tSql}
                  id={"sql-ipt"}
                  onChange={(e) => {
                    setTSql(e.target.value);
                  }}
                />
                <Button
                  variant={"brand"}
                  leftIcon={<FaPlay />}
                  onClick={() => {
                    setSql(tSql);
                  }}
                >
                  {t("db.run")}
                </Button>
              </HStack>
              {sql.toUpperCase().startsWith("SELECT") && result.length ? (
                <>
                  <Table>
                    <Thead>
                      <Tr>
                        {result.length > 0 ? (
                          <>
                            {Object.keys(result[0]).map((k) => (
                              <Th>{k}</Th>
                            ))}
                          </>
                        ) : (
                          <></>
                        )}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {result.map((r) => (
                        <Tr>
                          {Object.keys(r).map((k) => (
                            <Td>{r[k]}</Td>
                          ))}
                        </Tr>
                      ))}
                    </Tbody>
                    <TableCaption>
                      {result.length} {t("db.run.sql.items.found")}
                    </TableCaption>
                  </Table>
                </>
              ) : (
                <>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>{t("db.run.sql.exec.field.count")}</Th>
                        <Th>{t("db.run.sql.exec.rows.affected")}</Th>
                        <Th>Info</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>{(result as any).fieldCount}</Td>
                        <Td>{(result as any).affectedRows}</Td>
                        <Td>{(result as any).info}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </>
              )}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}
