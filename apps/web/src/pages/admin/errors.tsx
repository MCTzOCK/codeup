/**
 * apps/web/src/pages/admin/errors.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.04.23
 *
 */

import React from "react";
import AdminLayout from "@codeup/components/dist/admin/AdminLayout";
import REST from "@codeup/rest/src";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import ErrorComponent from "@codeup/components/dist/global/ErrorComponent";
import {
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  IconButton,
  MenuButton,
  MenuList,
  MenuItem,
  Menu,
} from "@chakra-ui/react";
import SuperText from "@codeup/components/dist/landingpage/SuperText";
import AccountManager from "@codeup/util/dist/AccountManager";
import { FaCheck, FaFilter, FaSearch } from "react-icons/fa";
import { FiRotateCw } from "react-icons/fi";
import { CHeading } from "@codeup/components/dist/global/CHeading";

export default function Errors() {
  const [errors, setErrors] = React.useState<
    {
      name: string;
      message: string;
      stack: string;
      createdAt: string;
      _id: string;
    }[]
  >([]);
  const [errorNames, setErrorNames] = React.useState<string[]>([]);
  const [selectedErrorName, setSelectedErrorName] =
    React.useState<string>("_all");
  const [query, setQuery] = React.useState<string>("");

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    reload();
  }, []);

  const reload = () => {
    REST.Admin.getErrors(AccountManager.getActiveToken()).then((res) => {
      if (res.status === 200) {
        setErrors(res.payload as any);
        let errNs: string[] = [
          ...new Set(
            (res.payload as any).map((e: any) => {
              return e.name;
            })
          ),
        ] as string[];
        setErrorNames(errNs);
        setLoading(false);
      } else {
        setError(true);
        setLoading(false);
      }
    });
  };

  return (
    <>
      <AdminLayout>
        {loading ? (
          <AuthenticateLoadingIndicator text={"Lade Fehler..."} />
        ) : (
          <>
            {error ? (
              <>
                <ErrorComponent
                  description={
                    "Beim Laden der Fehler ist ein Fehler aufgetreten."
                  }
                />
              </>
            ) : (
              <>
                <Box textAlign={"center"}>
                  <CHeading size={"xl"}>Fehler</CHeading>
                </Box>
                <Box p={6}>
                  <Flex w={"100%"} gap={4} mb={4}>
                    <InputGroup>
                      <InputLeftElement>
                        <FaSearch />
                      </InputLeftElement>
                      <Input
                        placeholder={"Suchen"}
                        value={query}
                        onChange={(e) => {
                          setQuery(e.target.value);
                        }}
                      />
                    </InputGroup>
                    <Menu>
                      <IconButton
                        aria-label={"refresh"}
                        icon={<FiRotateCw />}
                        onClick={async () => {
                          setLoading(true);
                          reload();
                        }}
                      />
                      <MenuButton
                        as={IconButton}
                        icon={<FaFilter />}
                        aria-label={"Filter"}
                      />
                      <MenuList>
                        <MenuItem
                          key={"_all"}
                          onClick={() => {
                            setSelectedErrorName("_all");
                          }}
                          icon={
                            selectedErrorName === "_all" ? <FaCheck /> : <></>
                          }
                        >
                          Alle
                        </MenuItem>
                        {errorNames.map((option) => (
                          <MenuItem
                            key={option}
                            onClick={() => {
                              setSelectedErrorName(option);
                            }}
                            icon={
                              selectedErrorName === option ? <FaCheck /> : <></>
                            }
                          >
                            {option}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </Flex>
                  <Accordion allowMultiple allowToggle>
                    {errors
                      .filter((e) => {
                        return (
                          e.name.toLowerCase().includes(query.toLowerCase()) ||
                          e.message
                            .toLowerCase()
                            .includes(query.toLowerCase()) ||
                          e.stack.toLowerCase().includes(query.toLowerCase()) ||
                          new Date(e.createdAt)
                            .toLocaleString()
                            .toLowerCase()
                            .includes(query.toLowerCase())
                        );
                      })
                      .filter((e) => {
                        return (
                          selectedErrorName === "_all" ||
                          e.name === selectedErrorName
                        );
                      })
                      .map((e) => {
                        return (
                          <>
                            <AccordionItem>
                              <h2>
                                <AccordionButton>
                                  <Box as="span" flex="1" textAlign="left">
                                    {new Date(e.createdAt).toLocaleString()}
                                    &nbsp;-&nbsp;
                                    {e.name}
                                    &nbsp;-&nbsp;
                                    {e.message}
                                  </Box>
                                  <AccordionIcon />
                                </AccordionButton>
                              </h2>
                              <AccordionPanel pb={4}>
                                <pre>{e.stack}</pre>
                              </AccordionPanel>
                            </AccordionItem>
                          </>
                        );
                      })}
                  </Accordion>
                </Box>
              </>
            )}
          </>
        )}
      </AdminLayout>
    </>
  );
}
