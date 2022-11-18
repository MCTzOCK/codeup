/**
 * packages/components/admin/AdminUserCreator.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.10.22
 *
 */

import * as React from "react";
import CodeUpModal from "../codeup/CodeUpModal";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Flex,
  Box,
  useToast,
  Select,
  Checkbox,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import REST from "@codeup/rest";
import { FaLock, FaMailBulk, FaUser, FaUserTag } from "react-icons/fa";

export default function AdminUserCreator(props: {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
  setUsers: (users: any) => void;
  users: any[];
}) {
  const toast = useToast();

  return (
    <>
      <CodeUpModal
        onOpen={props.onOpen}
        onClose={props.onClose}
        isOpen={props.isOpen}
        title={"Benutzer Erstellen"}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            const form = e.target as HTMLFormElement;

            // @ts-ignore
            const name = form.username.value;
            // @ts-ignore
            const firstName = form.firstName.value;
            // @ts-ignore
            const lastName = form.lastName.value;
            // @ts-ignore
            const email = form.email.value;
            // @ts-ignore
            const password = form.password.value;
            // @ts-ignore
            const role = form.role.value;
            // @ts-ignore
            const active = form.active.checked;

            const a = await REST.Admin.createAccount({
              username: name,
              email: email,
              password: password,
              role: role,
              active: active,
              firstName: firstName,
              lastName: lastName,
              token: localStorage.getItem("token") as string,
            });

            if (a.status === 200) {
              props.setUsers([...props.users, a.payload.user]);
              props.onClose();
            } else {
              toast({
                title: "Fehler",
                description: a.payload.error,
                status: "error",
                duration: 5000,
                isClosable: true,
              });
            }
          }}
        >
          <Stack spacing={3}>
            <FormControl id="username">
              <FormLabel>Benutzername</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <FaUser />
                </InputLeftElement>
                <Input type="text" name={"username"} />
              </InputGroup>
            </FormControl>
            <FormControl id={"email"}>
              <FormLabel>E-Mail</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <FaMailBulk />
                </InputLeftElement>
                <Input type="email" name={"mail"} />
              </InputGroup>
            </FormControl>
            <FormControl id={"firstName"}>
              <FormLabel>Vorname</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <FaUser />
                </InputLeftElement>
                <Input type="text" name={"firstName"} />
              </InputGroup>
            </FormControl>
            <FormControl id={"lastName"}>
              <FormLabel>Nachname</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <FaUser />
                </InputLeftElement>
                <Input type="text" name={"lastName"} />
              </InputGroup>
            </FormControl>
            <FormControl id="password">
              <FormLabel>Passwort</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <FaLock />
                </InputLeftElement>
                <Input type="password" name={"password"} />
              </InputGroup>
            </FormControl>
            <FormControl id="role">
              <FormLabel>Rolle</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <FaUserTag />
                </InputLeftElement>
                <Input type="text" name={"role"} defaultValue={"user"} />
              </InputGroup>
            </FormControl>
            <FormControl id="active">
              <FormLabel>Aktiv</FormLabel>
              <Checkbox name={"active"} defaultChecked>
                Aktiv
              </Checkbox>
            </FormControl>

            <Flex>
              <Box mr={"auto"}>
                <Button colorScheme="green" type="submit">
                  Erstellen
                </Button>
              </Box>
            </Flex>
          </Stack>
        </form>
      </CodeUpModal>
    </>
  );
}
