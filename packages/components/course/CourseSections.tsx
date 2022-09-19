/**
 * packages/components/course/CourseSections.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.09.2022
 *
 */

import * as React from "react";
import { Button, Flex, useDisclosure } from "@chakra-ui/react";
import { FaFile } from "react-icons/fa";
import { useRouter } from "next/router";
import CodeUpModal from "../codeup/CodeUpModal";
import { useEffect } from "react";

export default function CourseSections(props: {
  course: string;
  sections: {
    title: string;
    url: string;
  }[];
}) {
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [buttonVisible, setButtonVisible] = React.useState(true);

  useEffect(() => {
    window.addEventListener(
      "codeup::courses:open_sections?" +
        props.course.toLowerCase().replace(" ", "_"),
      onOpen
    );

    return () => {
      window.removeEventListener(
        "codeup::courses:open_sections?" +
          props.course.toLowerCase().replace(" ", "_"),
        onOpen
      );
    };
  });

  useEffect(() => {
    const handler = () => {
      setButtonVisible(!buttonVisible);
    };

    window.addEventListener(
      "codeup::courses:toggle_s_button?" +
        props.course.toLowerCase().replace(" ", "_"),
      handler
    );

    return () => {
      window.removeEventListener(
        "codeup::courses:toggle_s_button?" +
          props.course.toLowerCase().replace(" ", "_"),
        handler
      );
    };
  });

  return (
    <>
      <Flex
        bottom={["1.2rem", "initial"]}
        right={["initial", "1.2rem"]}
        top={["initial", "10rem"]}
        position={"fixed"}
        width={"100%"}
        alignItems={"center"}
        justifyContent={["center", "flex-end"]}
        zIndex={5}
      >
        <Button
          aria-label={"section-view"}
          leftIcon={<FaFile />}
          colorScheme={"blue"}
          onClick={onOpen}
          size={"lg"}
          display={buttonVisible ? "initial" : "none"}
          id={"open-sections-" + props.course.toLowerCase().replace(" ", "_")}
        >
          Lektionen
        </Button>
      </Flex>
      <CodeUpModal
        onOpen={onOpen}
        onClose={onClose}
        isOpen={isOpen}
        title={props.course}
        noCloseButton={false}
      >
        <Flex direction={"column"} gap={"1.2rem"}>
          {props.sections.map((section, i) => {
            return (
              <Button
                key={i}
                rounded={"none"}
                justifyContent={"left"}
                onClick={() => {
                  router.push(section.url);
                  onClose();
                }}
              >
                {i + 1}.&nbsp;{section.title}
              </Button>
            );
          })}
        </Flex>
      </CodeUpModal>
    </>
  );
}
