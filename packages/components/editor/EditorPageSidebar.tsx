/**
 * packages/components/editor/EditorPageSidebar.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.01.23
 *
 */
import * as React from "react";
import {
  Box,
  Flex,
  IconButton,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FaCode,
  FaEye,
  FaFile,
  FaFileAlt,
  FaFileCode,
  FaHome,
  FaJs,
  FaLaptopCode,
  FaResolving,
} from "react-icons/fa";
import { useRouter } from "next/router";
import { Socket } from "socket.io-client";
import PageResourceManager from "./PageResourceManager";
import { PreviewModal, SnippetViewer } from "../ide";
import EditorPreviewModal from "./EditorPreviewModal";

export default function EditorPageSidebar(props: {
  page: {
    url: string;
    mainContent: string;
    type: string;
    resources: {
      name: string;
      type: string;
      content: string;
    }[];
  };
  socket: Socket;
  projectId: string;
  setPage: (newPage: any) => void;
  setCurrentResource: (xx: string) => void;
}) {
  const router = useRouter();

  const {
    onOpen: onRMOpen,
    isOpen: isRMOpen,
    onClose: onRMClose,
  } = useDisclosure();

  const {
    onOpen: onSVOpen,
    isOpen: isSVOpen,
    onClose: onSVClose,
  } = useDisclosure();

  const {
    onOpen: onPROpen,
    isOpen: isPROpen,
    onClose: onPRClose,
  } = useDisclosure();

  return (
    <>
      <Box p={"2rem"} w={"100%"} h={"100%"} rounded={"xl"}>
        <Box backgroundColor={"black"} h={"100%"} boxShadow={"2xl"}>
          <Flex direction={"column"} h={"100%"}>
            <Tooltip label={"Code"} placement={"right"} hasArrow>
              <IconButton
                aria-label={""}
                variant="ghost"
                size={"lg"}
                fontSize={"2xl"}
                p={"2rem"}
                icon={<FaCode />}
                rounded={"none"}
                onClick={() => {
                  props.setCurrentResource("codeup.main_resource");
                  // @ts-ignore
                  window.__editor_current_resource = "codeup.main_resource";
                }}
              />
            </Tooltip>
            <Tooltip label={"Resourcen"} placement={"right"} hasArrow>
              <IconButton
                aria-label={""}
                variant="ghost"
                size={"lg"}
                fontSize={"2xl"}
                p={"2rem"}
                icon={<FaFileAlt />}
                rounded={"none"}
                onClick={onRMOpen}
              />
            </Tooltip>
            <Tooltip label={"Snippets"} placement={"right"} hasArrow>
              <IconButton
                aria-label={""}
                variant="ghost"
                size={"lg"}
                fontSize={"2xl"}
                p={"2rem"}
                icon={<FaLaptopCode />}
                rounded={"none"}
                onClick={onSVOpen}
              />
            </Tooltip>

            <Tooltip label={"Vorschau"} placement={"right"} hasArrow>
              <IconButton
                aria-label={""}
                variant="ghost"
                size={"lg"}
                fontSize={"2xl"}
                p={"2rem"}
                icon={<FaEye />}
                rounded={"none"}
                onClick={onPROpen}
              />
            </Tooltip>
            <Tooltip label={"Übersicht"} placement={"right"} hasArrow>
              <IconButton
                aria-label={""}
                variant="ghost"
                size={"lg"}
                fontSize={"2xl"}
                p={"2rem"}
                icon={<FaHome />}
                rounded={"none"}
                onClick={() => {
                  router.push("/editor/" + props.projectId);
                }}
              />
            </Tooltip>
          </Flex>
        </Box>
      </Box>
      <PageResourceManager
        socket={props.socket}
        onOpen={onRMOpen}
        onClose={onRMClose}
        isOpen={isRMOpen}
        page={props.page}
        setPage={props.setPage}
        setCurrentResource={props.setCurrentResource}
      />
      <SnippetViewer isOpen={isSVOpen} onClose={onSVClose} />
      <EditorPreviewModal
        url={"/editor-preview/" + router.query.page_id}
        isOpen={isPROpen}
        onOpen={onPROpen}
        onClose={onPRClose}
      />
    </>
  );
}
