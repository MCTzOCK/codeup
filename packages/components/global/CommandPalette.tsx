/**
 * packages/components/global/CommandPalette.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 29.12.2022
 *
 */

import * as React from "react";
import {
  Box,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  ListItem,
  Text,
  UnorderedList,
  useToast,
} from "@chakra-ui/react";
import {
  FaBookOpen,
  FaCode,
  FaFolder,
  FaGlobe,
  FaLightbulb,
  FaPlus,
  FaSearch,
  FaTachometerAlt,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import REST from "@codeup/rest/dist";
import { useRouter } from "next/router";
import { FiMessageSquare } from "react-icons/fi";
import { useLoggedIn, useUserInfo } from "@codeup/hooks";

export default function CommandPalette() {
  const [open, setOpen] = React.useState(false);

  const inputRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const [value, setValue] = React.useState("");
  const { loggedIn, loaded, userInfo } = useLoggedIn();

  const [results, setResults] = React.useState<
    {
      title: string;
      subtitle?: string;
      icon: any;
      onClick: () => void;
    }[]
  >([]);

  const router = useRouter();
  const toast = useToast();

  const [currentSelection, setCurrentSelection] = React.useState(0);

  React.useEffect(() => {
    window.addEventListener("codeup::open_search", (e) => {
      e.preventDefault();
      setOpen(true);
    });

    const listener = (e: KeyboardEvent) => {
      // CTRL + K or CMD + K or CTRL + SHIFT + P or CMD + SHIFT + P
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "k" || e.key === "p") &&
        !open &&
        inputRef.current
      ) {
        e.preventDefault();
        setOpen(true);
        inputRef.current.focus();
      } else if (e.key === "Escape" && open && inputRef.current) {
        e.preventDefault();
        hide();
      }
    };

    window.addEventListener("keydown", listener);

    return () => {
      document.removeEventListener("keydown", listener);
    };
  });

  React.useEffect(() => {
    if (value.length < 3 || !loggedIn) {
      return;
    }

    setCurrentSelection(0);

    if (value.startsWith("@")) {
      setResults([
        {
          title: "Zu Benutzer @" + value.substring(1) + " springen",
          icon: <FaUser />,
          onClick: () => {
            router.push("/forum/" + value.substring(1));
            hide();
          },
        },
        {
          title: "Direktnachricht an @" + value.substring(1) + " senden",
          icon: <FiMessageSquare />,
          onClick: async () => {
            const directMessage = await REST.Forum.createChatV2({
              token: localStorage.getItem("token") as string,
              user: value.substring(1),
            });

            router.push(
              "/forum/messages/?chat=" + directMessage.payload.chat._id
            );
            hide();
          },
        },
      ]);
    } else if (value.startsWith("!")) {
      let page = value.substring(1).split("/")[0];
      let sub_page = value.substring(1).split("/")[1];

      switch (page.toLowerCase()) {
        case "forum":
          if (!sub_page) {
            setResults([
              {
                title: "Zum Forum springen",
                icon: <FaUsers />,
                subtitle: "!forum",
                onClick: () => {
                  router.push("/forum");
                  hide();
                },
              },
              {
                title: "Zu deinem Profil springen",
                subtitle: "!forum/profil",
                icon: <FaUser />,
                onClick: () => {
                  router.push("/forum/" + userInfo?.username);
                  hide();
                },
              },
              {
                title: "Zu den Nachrichten springen",
                icon: <FiMessageSquare />,
                subtitle: "!forum/nachrichten",
                onClick: () => {
                  router.push("/forum/messages");
                  hide();
                },
              },
            ]);
          } else {
            let x = sub_page.toLowerCase().trim();
            if (x === "nachrichten") {
              setResults([
                {
                  title: "Zu den Nachrichten springen",
                  icon: <FiMessageSquare />,
                  onClick: () => {
                    router.push("/forum/messages");
                    hide();
                  },
                },
              ]);
            } else if (x === "mein-profil" || x === "profil") {
              setResults([
                {
                  title: "Zu deinem Profil springen",
                  icon: <FaUser />,
                  onClick: () => {
                    router.push("/forum/" + userInfo?.username);
                    hide();
                  },
                },
              ]);
            } else {
              if (x.startsWith("@")) {
                x = x.substring(1);
              }

              setResults([
                {
                  title: "Zu Benutzer @" + x + " springen",
                  icon: <FaUser />,
                  onClick: () => {
                    router.push("/forum/" + x);
                    hide();
                  },
                },
                {
                  title:
                    "Direktnachricht an @" + value.substring(1) + " senden",
                  icon: <FiMessageSquare />,
                  onClick: async () => {
                    const directMessage = await REST.Forum.createChatV2({
                      token: localStorage.getItem("token") as string,
                      user: value.substring(1),
                    });

                    router.push(
                      "/forum/messages/?chat=" + directMessage.payload.chat._id
                    );
                    hide();
                  },
                },
              ]);
            }
          }
          break;
        case "editor":
          if (!sub_page) {
            setResults([
              {
                title: "Zum Editor springen",
                subtitle: "!editor",
                icon: <FaCode />,
                onClick: () => {
                  router.push("/ide");
                  hide();
                },
              },
              {
                title: "Zu deinen Projekten springen",
                subtitle: "!editor/projekte",
                icon: <FaFolder />,
                onClick: () => {
                  router.push("/ide?component=open");
                  hide();
                },
              },
              {
                title: "Neues Projekt erstellen",
                subtitle: "!editor/neu",
                icon: <FaPlus />,
                onClick: () => {
                  router.push("/ide?component=create");
                  hide();
                },
              },
            ]);
          } else {
            let x = sub_page.toLowerCase().trim();
            if (x === "projekte") {
              setResults([
                {
                  title: "Zu deinen Projekten springen",
                  subtitle: "!editor/projekte",
                  icon: <FaFolder />,
                  onClick: () => {
                    router.push("/ide?component=open");
                    hide();
                  },
                },
              ]);
            } else if (x.split(" ")[0] === "neu") {
              if (x.split(" ").length > 1) {
                const name = x.split(" ").slice(1).join(" ");

                setResults([
                  {
                    title: "Neues Projekt mit Namen '" + name + "' erstellen",
                    subtitle: "!editor/neu " + name,
                    icon: <FaPlus />,
                    onClick: () => {
                      REST.IDE.createProject({
                        token: localStorage.getItem("token") as string,
                        name: name,
                      }).then((res) => {
                        if (res.status !== 200) {
                          toast({
                            title: "Fehler",
                            description: res.payload.error,
                            status: "error",
                            duration: 1500,
                            isClosable: true,
                            position: "bottom-right",
                          });
                        } else {
                          router.push(
                            "/ide/project/" +
                              res.payload.project._id +
                              "#editor-wrapper-flex"
                          );
                          hide();
                        }
                      });
                    },
                  },
                ]);
              } else {
                setResults([
                  {
                    title: "Neues Projekt erstellen",
                    subtitle: "!editor/neu",
                    icon: <FaPlus />,
                    onClick: () => {
                      router.push("/ide?component=create");
                      hide();
                    },
                  },
                ]);
              }
            } else {
              REST.IDE.getProjects({
                token: localStorage.getItem("token") as string,
                minimal: true,
                type: "ALL",
                withStats: false,
              }).then((res) => {
                if (res.status === 200) {
                  let projects = res.payload.projects.filter((project: any) =>
                    project.name.toLowerCase().includes(x)
                  );

                  setResults(
                    projects.map((project: any) => {
                      return {
                        title: project.name,
                        icon: <FaFolder />,
                        onClick: () => {
                          router.push(
                            "/ide/project/" +
                              project.id +
                              "#editor-wrapper-flex"
                          );
                          hide();
                        },
                      };
                    })
                  );
                } else {
                  setResults([
                    {
                      title: "Zum Editor springen",
                      subtitle: "!editor",
                      icon: <FaCode />,
                      onClick: () => {
                        router.push("/ide");
                        hide();
                      },
                    },
                  ]);
                }
              });
            }
          }
          break;
        case "projekte":
          setResults([
            {
              title: "Zu den Projekten springen",
              subtitle: "!projekte",
              icon: <FaFolder />,
              onClick: () => {
                router.push("/discovery");
                hide();
              },
            },
          ]);
          break;
        case "dashboard":
          setResults([
            {
              title: "Zum Dashboard springen",
              subtitle: "!dashboard",
              icon: <FaTachometerAlt />,
              onClick: () => {
                router.push("/dashboard");
                hide();
              },
            },
          ]);
          break;
        case "ideen":
          setResults([
            {
              title: "Zu den Ideen springen",
              subtitle: "!ideen",
              icon: <FaLightbulb />,
              onClick: () => {
                router.push("/ideas");
                hide();
              },
            },
          ]);
          break;
        case "impressum":
          setResults([
            {
              title: "Zum Impressum springen",
              subtitle: "!impressum",
              icon: <FaBookOpen />,
              onClick: () => {
                router.push("/legal/imprint");
                hide();
              },
            },
          ]);
          break;
        case "datenschutz":
          setResults([
            {
              title: "Zur Datenschutzerklärung springen",
              subtitle: "!datenschutz",
              icon: <FaBookOpen />,
              onClick: () => {
                router.push("/legal/privacy");
                hide();
              },
            },
          ]);
          break;
        default:
          const fullPage = page + (sub_page ? "/" + sub_page : "");

          setResults([
            {
              title: "Zu Seite /" + fullPage + " springen",
              icon: <FaGlobe />,
              onClick: () => {
                router.push("/" + fullPage);
                hide();
              },
            },
          ]);
          break;
      }
    } else {
      setResults([
        {
          title: "Zu Seite /" + value + " springen",
          icon: <FaGlobe />,
          onClick: () => {
            router.push("/" + value);
            hide();
          },
        },
      ]);
    }
  }, [value]);

  const hide = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setOpen(false);
    setValue("");
  };

  return (
    <>
      <Box
        position="fixed"
        top="0"
        left="0"
        width="100vw"
        height="100vh"
        backgroundColor="rgba(0, 0, 0, 0.5)"
        zIndex="999"
        display={open ? "block" : "none"}
      >
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          width="50%"
          height="50%"
          borderRadius="10px"
          rounded={"xl"}
          backgroundColor={"gray.800"}
          p={"2rem"}
        >
          <InputGroup>
            <InputLeftElement>
              <FaSearch />
            </InputLeftElement>
            <Input
              placeholder={"Suchen oder Befehl eingeben"}
              id={"cmd-p-i"}
              ref={inputRef}
              defaultValue={value}
              onChange={() => {
                setValue(inputRef.current.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  if (currentSelection + 1 === results.length) {
                    setCurrentSelection(0);
                  } else {
                    setCurrentSelection((c) => c + 1);
                  }
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  if (currentSelection - 1 < 0) {
                    setCurrentSelection(results.length - 1);
                  } else {
                    setCurrentSelection((c) => c - 1);
                  }
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  results[currentSelection].onClick();
                }
              }}
            />
            <InputRightElement>
              <Heading
                size={"xl"}
                cursor={"pointer"}
                onClick={() => {
                  setValue("");
                  inputRef.current.value = "";
                }}
              >
                <TiDelete />
              </Heading>
            </InputRightElement>
          </InputGroup>
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"flex-start"}
            justifyContent={"flex-start"}
            width={"100%"}
            height={"100%"}
            overflow={"auto"}
          >
            {value.length >= 3 && loggedIn ? (
              <>
                {results.map((r, i) => (
                  <Box
                    key={i}
                    display={"flex"}
                    flexDirection={"row"}
                    alignItems={"center"}
                    justifyContent={"flex-start"}
                    width={"100%"}
                    height={"auto"}
                    cursor={"pointer"}
                    mt={4}
                    backgroundColor={
                      currentSelection === i ? "gray.700" : "transparent"
                    }
                    onClick={() => {
                      r.onClick();
                    }}
                    _hover={{
                      backgroundColor: "gray.700",
                    }}
                    p={"0.5rem"}
                  >
                    {r.icon}
                    <Box
                      display={"flex"}
                      flexDirection={"row"}
                      alignItems={"center"}
                      justifyContent={"flex-start"}
                      width={"100%"}
                      height={"auto"}
                    >
                      <Box
                        display={"flex"}
                        flexDirection={"row"}
                        alignItems={"center"}
                        justifyContent={"flex-start"}
                        width={"auto"}
                        height={"auto"}
                        mr={"1rem"}
                      >
                        <Box
                          display={"flex"}
                          flexDirection={"column"}
                          alignItems={"flex-start"}
                          justifyContent={"flex-start"}
                          width={"auto"}
                          height={"auto"}
                          ml={"0.5rem"}
                        >
                          <Text fontSize={"xl"}>{r.title}</Text>
                          <Text fontSize={"md"} color={"gray.200"}>
                            {r.subtitle}
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </>
            ) : (
              <>
                <Flex
                  w={"100%"}
                  h={"fit-content"}
                  minH={"100%"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  flexDirection={"column"}
                >
                  <Box>
                    {loggedIn ? (
                      <>
                        <Heading size={"lg"}>
                          Suchen oder Befehl eingeben
                        </Heading>
                        <Text mt={8} fontSize={"lg"} fontFamily={"monospace"}>
                          Beispiele:
                        </Text>
                        <UnorderedList fontSize={"lg"} fontFamily={"monospace"}>
                          <ListItem>
                            <code>@ben.sbrt</code> - Optionen für Benutzer
                            anzeigen
                          </ListItem>
                          <ListItem>
                            <code>!forum</code> - Forum öffnen + Optionen
                            anzeigen
                          </ListItem>
                          <ListItem>
                            <code>!editor</code> - Editor öffnen + Optionen
                            anzeigen
                          </ListItem>
                          <ListItem>
                            <code>!editor/neu &lt;name&gt;</code> - Erstellt ein
                            neues Projekt mit dem Namen &lt;name&gt;
                          </ListItem>
                          <ListItem>
                            <code>!editor/&lt;name&gt;</code> - Öffnet das
                            Projekt mit dem Namen &lt;name&gt;
                          </ListItem>
                        </UnorderedList>
                      </>
                    ) : (
                      <>
                        <Heading size={"lg"}>Schnellzugriff</Heading>
                        <Text mt={8} fontSize={"lg"} fontFamily={"monospace"}>
                          Bitte melde dich an, um den Schnellzugriff zu nutzen.
                        </Text>
                      </>
                    )}
                  </Box>

                  <Text
                    mt={8}
                    fontSize={"lg"}
                    fontFamily={"monospace"}
                    color={"blue.300"}
                    cursor={"pointer"}
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    Schließen
                  </Text>
                </Flex>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}
