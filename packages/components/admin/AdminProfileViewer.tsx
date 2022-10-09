/**
 * packages/components/admin/AdminProfileViewer.tsx
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
  FormControl,
  FormLabel,
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
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  FaCheck,
  FaCheckSquare,
  FaCross,
  FaEdit,
  FaTrash,
  FaWindowClose,
  FaUser,
  FaLock,
  FaEnvelope,
  FaPen,
  FaUserShield,
} from "react-icons/fa";
import { useEffect } from "react";
import REST from "@codeup/rest";
import { useLoggedIn, useUserInfo } from "@codeup/hooks";

export default function AdminProfileViewer(props: {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
}) {
  const [editMode, setEditMode] = React.useState(false);

  const { userInfo, loggedIn, loaded } = useLoggedIn();

  return (
    <>
      <CodeUpModal
        onOpen={props.onOpen}
        onClose={() => {
          setEditMode(false);
          props.onClose();
        }}
        isOpen={props.isOpen}
        title={"Profilverwaltung"}
      >
        123
      </CodeUpModal>
    </>
  );
}
