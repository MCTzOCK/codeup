/**
 * packages/components/creator/studio/CourseEditor.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.11.2022
 *
 */

import * as React from "react";
import CodeUpModal from "../../codeup/CodeUpModal";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { FaCheckCircle, FaPen, FaTimesCircle, FaTrash } from "react-icons/fa";
import REST from "@codeup/rest";
import { useLoggedIn } from "@codeup/hooks";
import AccountManager from "@codeup/util/dist/AccountManager";

export default function CourseEditor(props: {
  course: {
    __v: number;
    _id: string;
    available: string;
    contentPositions: string[];
    createdAt: string;
    creator: string;
    description: string;
    friendlyName: string;
    name: string;
    splashImage: string;
  } | null;
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
  reload: () => void;
}) {
  const toast = useToast();

  const { userInfo } = useLoggedIn();

  const [orgs, setOrgs] = React.useState<
    {
      owner: string;
      name: string;
      members: string[];
      icon: string;
      subscription: string;
      createdAt: string;
      _id: string;
    }[]
  >([]);

  React.useEffect(() => {
    REST.Orgs.getOrgs(AccountManager.getActiveToken()).then((r) => {
      setOrgs(r.payload.orgs);
    });
  }, [userInfo]);

  return (
    <>
      <CodeUpModal
        onOpen={props.onOpen}
        onClose={props.onClose}
        isOpen={props.isOpen}
      >
        {props.course !== null && (
          <form
            onSubmit={(e) => {
              e.preventDefault();

              const data = new FormData(e.target as HTMLFormElement);

              const name = data.get("name") as string;
              const friendlyName = data.get("friendlyName") as string;
              const available = data.get("available") as any;
              const description = data.get("description") as string;
              const splashImage = data.get("splashImage") as File;

              const FR = new FileReader();

              FR.readAsDataURL(splashImage);

              FR.onload = async () => {
                if (props.course) {
                  const res = await REST.Creator.updateCourse({
                    token: localStorage.getItem("token") as string,
                    id: props.course ? props.course._id : "0x00",
                    update: {
                      name: name ? name : props.course.name,
                      friendlyName: friendlyName
                        ? friendlyName
                        : props.course.friendlyName,
                      available: available,
                      description: description
                        ? description
                        : props.course.description,
                      splashImage:
                        FR.result === "data:application/octet-stream;base64," ||
                        FR.result === "data:"
                          ? props.course.splashImage
                          : FR.result,
                    },
                  });

                  if (res.status === 200) {
                    toast({
                      title: "Kurs aktualisiert",
                      description: "Der Kurs wurde erfolgreich aktualisiert",
                      status: "success",
                      duration: 1500,
                      isClosable: true,
                    });

                    props.reload();
                    props.onClose();
                  } else {
                    toast({
                      title: "Fehler",
                      description:
                        "Aktualisierung fehlgeschlagen: " + res.payload.error,
                      status: "error",
                      duration: 1500,
                      isClosable: true,
                    });
                  }
                }
              };
            }}
          >
            <Image
              src={props.course.splashImage}
              alt={props.course.name}
              shadow={"xl"}
              w={"100%"}
              h={"150px"}
              cursor={"pointer"}
              _hover={{
                filter: "brightness(0.5)",
              }}
              transition={"filter 0.25s ease"}
              onClick={() => {
                document.getElementById(`edit_course-splashImage`)?.click();
              }}
              id={"edit_course-splashImage_Image"}
            />
            <input
              type={"file"}
              accept="image/svg+xml"
              name={"splashImage"}
              id={"edit_course-splashImage"}
              style={{
                display: "none",
              }}
              onChange={(e) => {
                const file = e.target.files?.item(0);
                if (file) {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => {
                    if (reader.result) {
                      (
                        document.getElementById(
                          `edit_course-splashImage_Image`
                        ) as HTMLElement
                      ).setAttribute("src", reader.result as string);
                    }
                  };
                }
              }}
            />
            <Input
              placeholder={"Name"}
              name={"name"}
              defaultValue={props.course.name}
              mt={"2rem"}
            />
            <InputGroup mt={"2rem"}>
              <InputLeftAddon>/course/</InputLeftAddon>
              <Input
                placeholder={"URL Freundlicher Name"}
                name={"friendlyName"}
                defaultValue={props.course.friendlyName}
              />
            </InputGroup>
            <Select
              name={"available"}
              mt={"2rem"}
              defaultValue={props.course.available}
            >
              <optgroup label={"Ganze Platform"}>
                {["editor", "admin"].includes(userInfo?.role) ? (
                  <>
                    <option value={"public"}>Öffentlich</option>
                  </>
                ) : null}
                <option value={"private"}>Privat</option>
              </optgroup>
              <optgroup label={"Deine Organisationen"}>
                {orgs
                  .filter((o) => {
                    return o.owner === userInfo?.id;
                  })
                  .map((org) => {
                    return (
                      <option value={"org:" + org._id}>
                        {org.name} ({org.members.length} Mitglieder)
                      </option>
                    );
                  })}
              </optgroup>
            </Select>
            <Textarea
              placeholder={"Beschreibung"}
              mt={"2rem"}
              name={"description"}
              defaultValue={props.course.description}
            />
            <ButtonGroup mt={"2rem"} w={"100%"}>
              <Button
                variant={"brand"}
                leftIcon={<FaCheckCircle />}
                w={"100%"}
                type={"submit"}
              >
                Speichern
              </Button>
            </ButtonGroup>
          </form>
        )}
      </CodeUpModal>
    </>
  );
}
