/**
 * apps/web/src/pages/admin/users/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.10.22
 *
 */

import { useLoggedIn } from "@codeup/hooks";
import router from "next/router";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
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
  Progress,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import AuthenticateLoadingIndicator from "@codeup/components/admin/AuthenticateLoadingIndicator";

export default function UserManagement() {
  const { loggedIn, userInfo, loaded: userLoaded } = useLoggedIn();

  useEffect(() => {
    if (!userLoaded) return;

    if (!loggedIn) {
      router.push(
        "/error?error=Du bist nicht dazu berechtigt diese Seite zu sehen!"
      );
      return;
    }

    if (!userInfo.admin) {
      router.push(
        "/error?error=Du bist nicht dazu berechtigt diese Seite zu sehen!"
      );
    }
  }, [loggedIn, userInfo, userLoaded]);

  const toast = useToast();

  const [users, setUsers] = useState([]);

  return (
    <>
      {!userLoaded ? (
        <>
          <AuthenticateLoadingIndicator />
        </>
      ) : null}
    </>
  );
}
