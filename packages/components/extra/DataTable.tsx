/**
 * packages/components/extra/DataTable.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.10.22
 *
 */
import React from "react";

import { useEffect, useState } from "react";
import {
  FaCheck,
  FaEdit,
  FaEllipsisH,
  FaEllipsisV,
  FaEye,
  FaFilter,
  FaHome,
  FaPlus,
  FaSort,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Center,
  CircularProgress,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Progress,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FiRotateCw, FiSearch } from "react-icons/fi";

export default function DataTable(props: {
  reload: () => void;
  columns: string[];
  data: any[][];
  filterOptions: string[];
  sortOptions: string[];
  filter: (query: string, filter: string, sort: string) => any[][];
}) {
  const [query, setQuery] = useState("");

  const [filter, setFilter] = useState(props.filterOptions[0]);

  const [sort, setSort] = useState(props.sortOptions[0]);

  const [loading, setLoading] = useState(false);

  return (
    <>
      <Box w={"100%"} mb={"2rem"}>
        <Flex
          w={"100%"}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={2}
        >
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Suche..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </InputGroup>
          <Menu>
            <IconButton
              aria-label={"refresh"}
              icon={<FiRotateCw />}
              onClick={async () => {
                setLoading(true);
                await props.reload();
                setLoading(false);
              }}
            />
            <MenuButton
              as={IconButton}
              icon={<FaFilter />}
              aria-label={"Filter"}
            />
            <MenuList>
              {props.filterOptions.map((option) => (
                <MenuItem
                  key={option}
                  onClick={() => {
                    setFilter(option);
                  }}
                  icon={filter === option ? <FaCheck /> : <></>}
                >
                  {option}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FaSort />}
              aria-label={"Sortieren"}
            />
            <MenuList>
              {props.sortOptions.map((option) => (
                <MenuItem
                  key={option}
                  onClick={() => {
                    setSort(option);
                  }}
                  icon={sort === option ? <FaCheck /> : <></>}
                >
                  {option}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Flex>
      </Box>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              {props.columns.map((c) => {
                return (
                  <>
                    <Th>{c}</Th>
                  </>
                );
              })}
            </Tr>
          </Thead>
          <Tbody>
            {!loading ? (
              <>
                {props.filter(query, filter, sort).map((d) => {
                  return (
                    <>
                      <Tr
                        onClick={(e: any) => {
                          d[0](e);
                        }}
                        _hover={{
                          backgroundColor: "gray.600",
                        }}
                        cursor={"pointer"}
                      >
                        {d.slice(1).map((c) => {
                          return (
                            <>
                              <Td>{c}</Td>
                            </>
                          );
                        })}
                      </Tr>
                    </>
                  );
                })}
              </>
            ) : (
              <>
                <Flex gap={"2rem"} alignItems={"center"}>
                  <Spinner size={"lg"} />
                  Lade...
                </Flex>
              </>
            )}
          </Tbody>
          <TableCaption>
            {props.filter(query, filter, sort).length}&nbsp;Einträge gefunden
          </TableCaption>
        </Table>
      </TableContainer>
    </>
  );
}
