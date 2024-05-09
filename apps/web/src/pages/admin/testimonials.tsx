/**
 * apps/web/src/pages/admin/testimonials.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 12.04.2023
 *
 */

import * as React from "react";
import Head from "next/head";
import AdminLayout from "@codeup/components/dist/admin/AdminLayout";
import SuperText from "@codeup/components/dist/landingpage/SuperText";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  SimpleGrid,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import REST from "@codeup/rest/dist";
import { FaPen, FaPlus, FaTrash } from "react-icons/fa";
import PopupManager from "../../global/PopupManager";
import AccountManager from "@codeup/util/dist/AccountManager";

export default function Testimonials() {
  const [testimonials, setTestimonials] = React.useState<
    {
      _id: string;
      name: string;
      position: string;
      company: string;
      image: string;
      content: string;
    }[]
  >([]);

  React.useEffect(() => {
    REST.Landingpage.getTestimonials().then((res) => {
      if (res.status === 200) {
        setTestimonials(res.payload as any);
      } else {
        alert(res.payload.error);
      }
    });
  }, []);

  return (
    <>
      <Head>
        <title>Meinungen - Admin - CodeUp</title>
      </Head>
      <AdminLayout>
        <Box mt={8}></Box>
        <SuperText>Meinungen</SuperText>
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          placeItems="center"
          spacing={1}
          mt={12}
          mb={4}
        >
          <Stack
            key={"-1"}
            direction={{ base: "column", sm: "row" }}
            spacing={2}
            mb={5}
            justify="center"
          >
            <Stack
              maxW="330px"
              minW={"300px"}
              boxShadow="lg"
              rounded="md"
              p={6}
              pos="relative"
              bg={"gray.900"}
              _after={{
                content: `""`,
                w: "0",
                h: "0",
                borderColor: `transparent ${"#141517"} transparent`,
                borderStyle: "solid",
                borderWidth: "10px 0 10px 10px",
                position: "absolute",
                top: { base: "unset", sm: "45%" },
                right: { base: "unset", sm: "-10px" },
                left: { base: "48%", sm: "unset" },
                bottom: { base: "-15px", sm: "unset" },
                transform: { base: "rotate(90deg)", sm: "unset" },
                display: "block",
              }}
            >
              <Text fontWeight="medium" fontSize="sm">
                Neue Meinung hinzufügen
              </Text>
              <StackDivider />
              <Button
                colorScheme={"green"}
                leftIcon={<FaPlus />}
                onClick={async () => {
                  const name = await PopupManager.promptAsync({
                    title: "Name",
                    helperText: "Name des Kunden",
                  });

                  if (!name) return;

                  const position = await PopupManager.promptAsync({
                    title: "Position",
                    helperText: "Position des Kunden",
                  });

                  if (!position) return;

                  const company = await PopupManager.promptAsync({
                    title: "Firma",
                    helperText: "Firma des Kunden",
                  });

                  if (!company) return;

                  const content = await PopupManager.promptAsync({
                    title: "Meinung",
                    helperText: "Meinung des Kunden",
                    inputType: "TEXTAREA",
                  });

                  if (!content) return;

                  const imageFL = await PopupManager.uploadFileAsync({
                    title: "Bild",
                    helperText: "Bild des Kunden",
                  });

                  if (!imageFL || !imageFL.item(0)) return;

                  const form = document.createElement("form");

                  const input = document.createElement("input");
                  input.type = "file";
                  input.name = "file";
                  input.files = imageFL;

                  form.appendChild(input);

                  const formData = new FormData(form);

                  const r = await fetch("/media/upload", {
                    method: "POST",
                    body: formData,
                  });

                  if (r.status === 200) {
                    const res = await r.json();

                    const url = res.data.url;

                    const res2 = await REST.Admin.createTestimonial({
                      token: AccountManager.getActiveToken(),
                      company,
                      content,
                      image: url,
                      name,
                      position,
                    });

                    if (res2.status === 200) {
                      PopupManager.alert({
                        title: "Erfolgreich",
                        description:
                          "Die Meinung wurde erfolgreich hinzugefügt!",
                      });

                      setTestimonials([...testimonials, res2.payload as any]);
                    } else {
                      PopupManager.alert({
                        title: "Fehler",
                        description:
                          "Beim hinzufügen der Meinung ist ein Fehler aufgetreten: " +
                          res2.payload.error,
                      });
                    }
                  } else {
                    PopupManager.alert({
                      title: "Fehler",
                      description:
                        "Beim hochladen des Bildes ist ein Fehler aufgetreten: " +
                        r.statusText,
                    });
                  }
                }}
              >
                Hinzufügen
              </Button>
            </Stack>
            <Stack
              direction="column"
              spacing={2}
              p={2}
              justify="flex-end"
              alignItems="center"
            >
              <Avatar
                size="xl"
                showBorder={true}
                borderColor="brand.500"
                name="avatar"
                src={"https://avatars.githubusercontent.com/u/53553315"}
              />
              <Box textAlign="center">
                <Text fontWeight="bold" fontSize="lg">
                  Neue Meinung
                </Text>
              </Box>
            </Stack>
          </Stack>
          {testimonials.map((obj, index) => (
            <>
              <Stack
                key={index}
                direction={{ base: "column", sm: "row" }}
                spacing={2}
                mb={5}
                justify="center"
              >
                <Stack
                  maxW="330px"
                  minW={"300px"}
                  boxShadow="lg"
                  rounded="md"
                  p={6}
                  pos="relative"
                  bg={"gray.900"}
                  _after={{
                    content: `""`,
                    w: "0",
                    h: "0",
                    borderColor: `transparent ${"#141517"} transparent`,
                    borderStyle: "solid",
                    borderWidth: "10px 0 10px 10px",
                    position: "absolute",
                    top: { base: "unset", sm: "45%" },
                    right: { base: "unset", sm: "-10px" },
                    left: { base: "48%", sm: "unset" },
                    bottom: { base: "-15px", sm: "unset" },
                    transform: { base: "rotate(90deg)", sm: "unset" },
                    display: "block",
                  }}
                >
                  <Text fontWeight="medium" fontSize="sm">
                    {obj.content}
                  </Text>
                  <ButtonGroup>
                    <Button
                      colorScheme={"red"}
                      leftIcon={<FaTrash />}
                      onClick={async () => {
                        if (
                          !(await PopupManager.confirmAsync({
                            title: "Löschen",
                            question:
                              "Soll die Meinung wirklich gelöscht werden?",
                          }))
                        )
                          return;

                        const res = await REST.Admin.deleteTestimonial({
                          token: AccountManager.getActiveToken(),
                          id: obj._id,
                        });

                        if (res.status === 200) {
                          PopupManager.alert({
                            title: "Erfolgreich",
                            description:
                              "Die Meinung wurde erfolgreich gelöscht!",
                          });

                          const newTestimonials = [...testimonials];
                          newTestimonials.splice(index, 1);

                          setTestimonials(newTestimonials);
                          return;
                        }

                        PopupManager.alert({
                          title: "Fehler",
                          description:
                            "Beim löschen der Meinung ist ein Fehler aufgetreten: " +
                            res.payload.error,
                        });
                      }}
                    >
                      Löschen
                    </Button>
                    <Button
                      colorScheme={"yellow"}
                      leftIcon={<FaPen />}
                      onClick={async () => {
                        const selected = await PopupManager.selectAsync({
                          title: "Bearbeiten",
                          helperText: "Wähle aus was du bearbeiten willst",
                          choices: [
                            "Name",
                            "Position",
                            "Firma",
                            "Meinung",
                            "Bild",
                          ],
                        });

                        if (!selected) return;

                        switch (selected) {
                          case "Name": {
                            const name = await PopupManager.promptAsync({
                              title: "Name",
                              helperText: "Name des Kunden",
                            });

                            if (!name) break;

                            const res = await REST.Admin.updateTestimonial({
                              token: AccountManager.getActiveToken(),
                              id: obj._id,
                              update: {
                                name,
                              },
                            });

                            if (res.status === 200) {
                              PopupManager.alert({
                                title: "Erfolgreich",
                                description:
                                  "Der Name wurde erfolgreich geändert!",
                              });

                              const newTestimonials = [...testimonials];
                              newTestimonials[index].name = name;

                              setTestimonials(newTestimonials);

                              break;
                            } else {
                              PopupManager.alert({
                                title: "Fehler",
                                description:
                                  "Beim ändern des Namens ist ein Fehler aufgetreten: " +
                                  res.payload.error,
                              });
                            }
                            break;
                          }
                          case "Position": {
                            const position = await PopupManager.promptAsync({
                              title: "Position",
                              helperText: "Position des Kunden",
                            });

                            if (!position) break;

                            const res = await REST.Admin.updateTestimonial({
                              token: AccountManager.getActiveToken(),
                              id: obj._id,
                              update: {
                                position,
                              },
                            });

                            if (res.status === 200) {
                              PopupManager.alert({
                                title: "Erfolgreich",
                                description:
                                  "Die Position wurde erfolgreich geändert!",
                              });

                              const newTestimonials = [...testimonials];
                              newTestimonials[index].position = position;

                              setTestimonials(newTestimonials);

                              break;
                            } else {
                              PopupManager.alert({
                                title: "Fehler",
                                description:
                                  "Beim ändern der Position ist ein Fehler aufgetreten: " +
                                  res.payload.error,
                              });
                            }
                            break;
                          }
                          case "Firma": {
                            const company = await PopupManager.promptAsync({
                              title: "Firma",
                              helperText: "Firma des Kunden",
                            });

                            if (!company) break;

                            const res = await REST.Admin.updateTestimonial({
                              token: AccountManager.getActiveToken(),
                              id: obj._id,
                              update: {
                                company,
                              },
                            });

                            if (res.status === 200) {
                              PopupManager.alert({
                                title: "Erfolgreich",
                                description:
                                  "Die Firma wurde erfolgreich geändert!",
                              });

                              const newTestimonials = [...testimonials];
                              newTestimonials[index].company = company;

                              setTestimonials(newTestimonials);
                              break;
                            } else {
                              PopupManager.alert({
                                title: "Fehler",
                                description:
                                  "Beim ändern der Firma ist ein Fehler aufgetreten: " +
                                  res.payload.error,
                              });
                            }
                            break;
                          }
                          case "Meinung": {
                            const content = await PopupManager.promptAsync({
                              title: "Meinung",
                              helperText: "Meinung des Kunden",
                              inputType: "TEXTAREA",
                            });

                            if (!content) break;

                            const res = await REST.Admin.updateTestimonial({
                              token: AccountManager.getActiveToken(),
                              id: obj._id,
                              update: {
                                content,
                              },
                            });

                            if (res.status === 200) {
                              PopupManager.alert({
                                title: "Erfolgreich",
                                description:
                                  "Die Meinung wurde erfolgreich geändert!",
                              });

                              const newTestimonials = [...testimonials];
                              newTestimonials[index].content = content;

                              setTestimonials(newTestimonials);
                              break;
                            } else {
                              PopupManager.alert({
                                title: "Fehler",
                                description:
                                  "Beim ändern der Meinung ist ein Fehler aufgetreten: " +
                                  res.payload.error,
                              });
                            }
                            break;
                          }
                          case "Bild": {
                            const imageFL = await PopupManager.uploadFileAsync({
                              title: "Bild",
                              helperText: "Bild des Kunden",
                            });

                            if (!imageFL || !imageFL.item(0)) break;

                            const form = document.createElement("form");

                            const input = document.createElement("input");
                            input.type = "file";
                            input.name = "file";
                            input.files = imageFL;

                            form.appendChild(input);

                            const formData = new FormData(form);

                            const r = await fetch("/media/upload", {
                              method: "POST",
                              body: formData,
                            });

                            if (r.status === 200) {
                              const res = await r.json();

                              const url = res.data.url;

                              const res2 = await REST.Admin.updateTestimonial({
                                token: AccountManager.getActiveToken(),
                                id: obj._id,
                                update: {
                                  image: url,
                                },
                              });

                              if (res2.status === 200) {
                                PopupManager.alert({
                                  title: "Erfolgreich",
                                  description:
                                    "Die Meinung wurde erfolgreich geändert!",
                                });

                                const newTestimonials = [...testimonials];
                                newTestimonials[index].image = url;

                                setTestimonials(newTestimonials);
                              } else {
                                PopupManager.alert({
                                  title: "Fehler",
                                  description:
                                    "Beim Ändern der Meinung ist ein Fehler aufgetreten: " +
                                    res2.payload.error,
                                });
                              }
                            } else {
                              PopupManager.alert({
                                title: "Fehler",
                                description:
                                  "Beim hochladen des Bildes ist ein Fehler aufgetreten: " +
                                  r.statusText,
                              });
                            }
                          }
                          default: {
                            PopupManager.alert({
                              title: "Fehler",
                              description:
                                "Diese Funktion ist noch nicht verfügbar",
                            });
                          }
                        }
                      }}
                    >
                      Bearbeiten
                    </Button>
                  </ButtonGroup>
                </Stack>
                <Stack
                  direction="column"
                  spacing={2}
                  p={2}
                  justify="flex-end"
                  alignItems="center"
                >
                  <Avatar
                    size="xl"
                    showBorder={true}
                    borderColor="brand.500"
                    name="avatar"
                    src={obj.image}
                  />
                  <Box textAlign="center">
                    <Text fontWeight="bold" fontSize="lg">
                      {obj.name}
                    </Text>
                    <Text fontWeight="medium" fontSize="xs" color="white">
                      {obj.position}, {obj.company}
                    </Text>
                  </Box>
                </Stack>
              </Stack>
            </>
          ))}
        </SimpleGrid>
      </AdminLayout>
    </>
  );
}
