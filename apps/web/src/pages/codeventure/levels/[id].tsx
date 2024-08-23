/**
 * apps/web/src/pages/codeventure/levels/[id].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.08.2024
 *
 */

import * as React from "react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import { sProp } from "../../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  IconButton,
  Image,
  Input,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import {
  FaCheck,
  FaPen,
  FaPlus,
  FaSave,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import PopupManager from "../../../global/PopupManager";
import Networking from "@codeup/util/dist/Networking";

export default function LevelEditor() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
    redirectToLogin: true,
  });

  const { t } = useTranslation("game");

  const [rawLevel, setRawLevel] = useState<{
    _id: string;
    name: string;
    user: string;
    content: string;
  } | null>(null);
  const [metadata, setMetadata] = useState<{
    name: string;
    author: {
      name: string;
      website: string;
    };
    description: string;
    splashImage: string;
  } | null>(null);
  const [timing, setTiming] = useState<{
    oneStar: number;
    twoStars: number;
    threeStars: number;
  } | null>(null);
  const [tiles, setTiles] = useState<
    {
      id: number;
      name: string;
      image: string;
      solid: boolean;
    }[]
  >([]);
  const [map, setMap] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [player, setPlayer] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [mapLayers, setMapLayers] = useState<number[][]>([]);
  const [scripts, setScripts] = useState<{
    [key: string]: string;
  } | null>(null);
  const [hooks, setHooks] = useState<{
    onLevelStart?: string;
    onLevelEnd?: string;
    onReset?: string;
  } | null>(null);
  const [finish, setFinish] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [extensions, setExtensions] = useState<{
    [key: string]: boolean;
  } | null>(null);
  const [entities, setEntities] = useState<
    {
      type: string;
      name: string;
      x: number;
      y: number;
      properties: {
        [key: string]: any;
      };
      extensions: {
        [key: string]: boolean;
      };
      hooks: {
        onWillAdd?: string;
        onAdded?: string;
        onWillInteract?: string;
        onInteract?: string;
      };
    }[]
  >([]);

  const router = useRouter();

  const reloadLevel = async () => {
    const res = await REST.Game.myLevels(AccountManager.getActiveToken());
    if (res.status !== 200) return;
    const lvl = res.payload.levels.find((l: any) => l._id === router.query.id);

    if (!lvl) return;

    const level = JSON.parse(lvl.content);

    if (level.metadata) {
      setMetadata(level.metadata);
    } else {
      setMetadata({
        name: level.name,
        author: {
          name: "CodeUp Benutzer",
          website: "https://codeup.space",
        },
        description: "Ein CodeVenture Level",
        splashImage: "https://codeup.space/codeup-splash-github.jpg",
      });
    }

    if (level.timing) {
      setTiming(level.timing);
    } else {
      setTiming({
        oneStar: 100,
        twoStars: 200,
        threeStars: 300,
      });
    }

    if (level.player) {
      setPlayer(level.player);
    } else {
      setPlayer({
        x: 0,
        y: 0,
      });
    }

    if (level.finish) {
      setFinish(level.finish);
    } else {
      setFinish({
        x: 0,
        y: 0,
      });
    }

    if (level.map) {
      setMap(level.map);
    } else {
      setMap({
        width: 10,
        height: 10,
      });
    }

    if (level.extensions) {
      setExtensions(level.extensions);
    } else {
      setExtensions({});
    }

    if (level.hooks) {
      setHooks(level.hooks);
    } else {
      setHooks({});
    }

    if (level.scripts) {
      setScripts(level.scripts);
    } else {
      setScripts({});
    }

    if (level.tiles) {
      setTiles(level.tiles);
    } else {
      setTiles([]);
    }

    if (level.mapLayers) {
      setMapLayers(level.mapLayers);
    } else {
      setMapLayers([]);
    }

    if (level.entities) {
      setEntities(level.entities);
    } else {
      setEntities([]);
    }

    setRawLevel(level);
  };

  const toJSON = (): any => {
    let json: any = {};
    json.metadata = metadata;
    json.timing = timing;
    json.tiles = tiles;
    json.map = map;
    json.player = player;
    json.mapLayers = mapLayers;
    json.scripts = scripts;
    json.hooks = hooks;
    json.finish = finish;
    json.extensions = extensions;
    json.entities = entities;

    return json;
  };

  const saveLevel = async () => {
    const res = await REST.Game.updateLevel(
      AccountManager.getActiveToken(),
      router.query.id as string,
      rawLevel!.name,
      JSON.stringify(toJSON())
    );
  };

  useEffect(() => {
    if (!router || !router.query || !router.query.id) return;
    reloadLevel();
  }, [router, router.query, router.query.id]);

  return (
    <>
      <Head>
        <title>{t("doc.title")}</title>
      </Head>
      {rawLevel && (
        <Box w={"100%"} h={"fit-content"} minH={"100vh"} bg={"#000"} p={4}>
          <Flex justifyContent={"space-between"}>
            <CHeading size={"lg"}>{rawLevel!.name}</CHeading>
            <Button variant={"brand"} leftIcon={<FaSave />} onClick={saveLevel}>
              {t("save")}
            </Button>
          </Flex>
          <Tabs mt={6}>
            <TabList overflowX={"scroll"}>
              <Tab>{t("section.metadata")}</Tab>
              <Tab>{t("section.timing")}</Tab>
              <Tab>{t("section.player")}</Tab>
              <Tab>{t("section.finish")}</Tab>
              <Tab>{t("section.map")}</Tab>
              <Tab>{t("section.extensions")}</Tab>
              <Tab>{t("section.hooks")}</Tab>
              <Tab>{t("section.scripts")}</Tab>
              <Tab>{t("section.tiles")}</Tab>
              <Tab>{t("section.map.layers")}</Tab>
              <Tab>{t("section.entities")}</Tab>
              <Tab>{t("section.publish")}</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel>{t("md.name")}</FormLabel>
                    <Input
                      value={metadata?.name}
                      onChange={(e) =>
                        setMetadata({
                          ...metadata!,
                          name: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>{t("md.author.name")}</FormLabel>
                    <Input
                      value={metadata?.author.name}
                      onChange={(e) =>
                        setMetadata({
                          ...metadata!,
                          author: {
                            ...metadata!.author,
                            name: e.target.value,
                          },
                        })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>{t("md.author.website")}</FormLabel>
                    <Input
                      value={metadata?.author.website}
                      onChange={(e) =>
                        setMetadata({
                          ...metadata!,
                          author: {
                            ...metadata!.author,
                            website: e.target.value,
                          },
                        })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>{t("md.description")}</FormLabel>
                    <Input
                      value={metadata?.description}
                      onChange={(e) =>
                        setMetadata({
                          ...metadata!,
                          description: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>{t("md.splash.image")}</FormLabel>
                    <Image
                      src={metadata?.splashImage}
                      alt={"Splash Image"}
                      h={"auto"}
                      maxH={"200px"}
                      rounded={"xl"}
                      _hover={{
                        cursor: "pointer",
                      }}
                      onClick={async () => {
                        const files = await PopupManager.uploadFileAsync({
                          title: t("md.splash.image"),
                          helperText: t("md.splash.image.helper"),
                        });

                        if (!files) return;

                        const reader = new FileReader();

                        reader.onload = async () => {
                          let result = reader.result as string;

                          result = result.replace(/^data:.+;base64,/g, "");

                          const res = await REST.UserContent.upload(
                            files[0].name,
                            result
                          );

                          if (res.status === 200) {
                            setMetadata({
                              ...metadata!,
                              splashImage: res.payload.url,
                            });
                          } else {
                            await PopupManager.alertAsync({
                              title: t("base:control.error"),
                              description:
                                t("base:control.error.request") +
                                res.payload.error,
                            });
                          }
                        };

                        reader.readAsDataURL(files[0]);
                      }}
                    />
                  </FormControl>
                </Stack>
              </TabPanel>
              <TabPanel>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel>{t("timing.one.star")}</FormLabel>
                    <Input
                      value={timing?.oneStar}
                      onChange={(e) =>
                        setTiming({
                          ...timing!,
                          oneStar: parseInt(e.target.value),
                        })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>{t("timing.two.stars")}</FormLabel>
                    <Input
                      value={timing?.twoStars}
                      onChange={(e) =>
                        setTiming({
                          ...timing!,
                          twoStars: parseInt(e.target.value),
                        })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>{t("timing.three.stars")}</FormLabel>
                    <Input
                      value={timing?.threeStars}
                      onChange={(e) =>
                        setTiming({
                          ...timing!,
                          threeStars: parseInt(e.target.value),
                        })
                      }
                    />
                  </FormControl>
                </Stack>
              </TabPanel>
              <TabPanel>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel>{t("player.x")}</FormLabel>
                    <Input
                      value={player?.x}
                      onChange={(e) =>
                        setPlayer({
                          ...player!,
                          x: parseInt(e.target.value),
                        })
                      }
                      type={"number"}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>{t("player.y")}</FormLabel>
                    <Input
                      value={player?.y}
                      onChange={(e) =>
                        setPlayer({
                          ...player!,
                          y: parseInt(e.target.value),
                        })
                      }
                      type={"number"}
                    />
                  </FormControl>
                </Stack>
              </TabPanel>
              <TabPanel>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel>{t("finish.x")}</FormLabel>
                    <Input
                      value={finish?.x}
                      onChange={(e) =>
                        setFinish({
                          ...finish!,
                          x: parseInt(e.target.value),
                        })
                      }
                      type={"number"}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>{t("finish.y")}</FormLabel>
                    <Input
                      value={finish?.y}
                      onChange={(e) =>
                        setFinish({
                          ...finish!,
                          y: parseInt(e.target.value),
                        })
                      }
                      type={"number"}
                    />
                  </FormControl>
                </Stack>
              </TabPanel>
              <TabPanel>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel>{t("map.width")}</FormLabel>
                    <Input
                      value={map?.width}
                      onChange={(e) =>
                        setMap({
                          ...map!,
                          width: parseInt(e.target.value),
                        })
                      }
                      type={"number"}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>{t("map.height")}</FormLabel>
                    <Input
                      value={map?.height}
                      onChange={(e) =>
                        setMap({
                          ...map!,
                          height: parseInt(e.target.value),
                        })
                      }
                      type={"number"}
                    />
                  </FormControl>
                </Stack>
              </TabPanel>
              <TabPanel>
                <Stack spacing={4}>
                  {Object.keys(extensions!).map((key) => (
                    <FormControl key={key}>
                      <FormLabel>{key}</FormLabel>
                      <Checkbox
                        colorScheme={"brand"}
                        isChecked={extensions![key]}
                        onChange={(e) =>
                          setExtensions({
                            ...extensions!,
                            [key]: e.target.checked,
                          })
                        }
                      />
                    </FormControl>
                  ))}
                  <Button
                    variant={"brand"}
                    onClick={async () => {
                      const key = await PopupManager.promptAsync({
                        title: t("extension.key"),
                        helperText: t("extension.key.helper"),
                      });

                      if (!key) return;

                      setExtensions({
                        ...extensions!,
                        [key]: true,
                      });
                    }}
                  >
                    {t("add")}
                  </Button>
                </Stack>
              </TabPanel>
              <TabPanel>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel>{t("hooks.on.level.start")}</FormLabel>
                    <Textarea
                      value={hooks?.onLevelStart}
                      onChange={(e) =>
                        setHooks({
                          ...hooks!,
                          onLevelStart: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>{t("hooks.on.level.end")}</FormLabel>
                    <Textarea
                      value={hooks?.onLevelEnd}
                      onChange={(e) =>
                        setHooks({
                          ...hooks!,
                          onLevelEnd: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>{t("hooks.on.reset")}</FormLabel>
                    <Textarea
                      value={hooks?.onReset}
                      onChange={(e) =>
                        setHooks({
                          ...hooks!,
                          onReset: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                </Stack>
              </TabPanel>
              <TabPanel>
                <Stack spacing={4}>
                  {Object.keys(scripts!).map((key) => (
                    <FormControl key={key}>
                      <FormLabel>{key}</FormLabel>
                      <Textarea
                        value={scripts![key]}
                        onChange={(e) =>
                          setScripts({
                            ...scripts!,
                            [key]: e.target.value,
                          })
                        }
                      />
                    </FormControl>
                  ))}
                  <Button
                    variant={"brand"}
                    onClick={async () => {
                      const key = await PopupManager.promptAsync({
                        title: t("script.name"),
                        helperText: t("script.name.helper"),
                      });

                      if (!key) return;

                      setScripts({
                        ...scripts!,
                        [key]: "",
                      });
                    }}
                  >
                    {t("add")}
                  </Button>
                </Stack>
              </TabPanel>
              <TabPanel>
                <Grid
                  templateColumns={"repeat(auto-fit, minmax(300px, 1fr));"}
                  gap={6}
                  p={4}
                >
                  {tiles.map((tile) => (
                    <Stack
                      key={tile.id}
                      bg={"black"}
                      rounded={"md"}
                      p={4}
                      maxW={"fit-content"}
                      spacing={4}
                      minW={"200px"}
                    >
                      <Image src={tile.image} alt={tile.name} />
                      <Text fontSize={"lg"} textAlign={"center"}>
                        {tile.name}
                      </Text>
                      <Button
                        colorScheme={tile.solid ? "red" : "green"}
                        onClick={() =>
                          setTiles(
                            tiles.map((t) =>
                              t.id === tile.id ? { ...t, solid: !t.solid } : t
                            )
                          )
                        }
                      >
                        {tile.solid ? t("solid") : t("not.solid")}
                      </Button>
                      <Button
                        colorScheme={"red"}
                        onClick={() =>
                          setTiles(tiles.filter((t) => t.id !== tile.id))
                        }
                      >
                        {t("delete")}
                      </Button>
                    </Stack>
                  ))}
                </Grid>
                <Button
                  variant={"brand"}
                  onClick={async () => {
                    const name = await PopupManager.promptAsync({
                      title: t("tile.name"),
                      helperText: t("tile.name.helper"),
                    });

                    if (!name) return;

                    const file = await PopupManager.uploadFileAsync({
                      title: t("tile.image"),
                      helperText: t("tile.image.helper"),
                    });

                    if (!file) return;

                    const reader = new FileReader();

                    reader.onload = async () => {
                      let result = reader.result as string;
                      result = result.replace(/^data:.+;base64,/g, "");
                      const res = await REST.UserContent.upload(
                        file[0].name,
                        result
                      );
                      if (res.status !== 200) {
                        await PopupManager.alertAsync({
                          title: t("base:control.error"),
                          description:
                            t("base:control.error.request") + res.payload.error,
                        });
                        return;
                      }
                      setTiles([
                        ...tiles,
                        {
                          id: tiles.length + 1,
                          name: name,
                          image: res.payload.url,
                          solid: false,
                        },
                      ]);
                    };

                    reader.readAsDataURL(file[0]);
                  }}
                >
                  {t("add")}
                </Button>
              </TabPanel>
              <TabPanel>
                <Stack spacing={4}>
                  {mapLayers.map((layer, li) => (
                    <Stack key={li} spacing={4}>
                      <Text>
                        {t("map.layer")} {li + 1}
                      </Text>
                      <Grid
                        templateColumns={`repeat(${map!.width}, 64px)`}
                        overflow={"scroll"}
                        maxW={"100%"}
                        gap={0}
                      >
                        {layer.map((tileId, index) => (
                          <Image
                            key={index}
                            w={"64px"}
                            h={"64px"}
                            bg={"black"}
                            cursor={"pointer"}
                            onClick={async () => {
                              const tile = await PopupManager.selectAsync({
                                title: t("select.tile"),
                                choices: tiles.map((t) => t.name),
                                helperText: t("select.tile.helper"),
                              });

                              if (!tile) return;

                              let newMapLayer = [...mapLayers[li]];

                              newMapLayer[index] = tiles.find(
                                (t) => t.name === tile
                              )!.id;

                              setMapLayers([
                                ...mapLayers.slice(0, li),
                                newMapLayer,
                                ...mapLayers.slice(li + 1),
                              ]);
                            }}
                            src={
                              tiles.find((t) => t.id === tileId)?.image ||
                              "https://craftypixels.com/placeholder-image/64x64x/ffffff/000000&text=Invis"
                            }
                          />
                        ))}
                      </Grid>
                      <Button
                        colorScheme={"red"}
                        onClick={() =>
                          setMapLayers(mapLayers.filter((_, i) => i !== li))
                        }
                      >
                        {t("delete")}
                      </Button>
                    </Stack>
                  ))}
                  <Button
                    variant={"brand"}
                    onClick={() =>
                      setMapLayers([
                        ...mapLayers,
                        new Array(map!.width * map!.height).fill(0),
                      ])
                    }
                  >
                    {t("add")}
                  </Button>
                </Stack>
              </TabPanel>
              <TabPanel>
                <Grid
                  templateColumns={"repeat(auto-fit, minmax(300px, 1fr));"}
                  p={4}
                >
                  {entities.map((entity, ei) => (
                    <Stack
                      key={ei}
                      bg={"black"}
                      rounded={"md"}
                      p={4}
                      maxW={"fit-content"}
                      spacing={4}
                      minW={"300px"}
                    >
                      <Text
                        fontSize={"md"}
                        textAlign={"center"}
                        fontWeight={"900"}
                        color={"brand.500"}
                      >
                        {entity.type}
                      </Text>
                      <HStack justifyContent={"space-between"}>
                        <Text fontSize={"lg"} textAlign={"center"}>
                          {entity.name}
                        </Text>

                        <IconButton
                          size={"sm"}
                          aria-label={"edit"}
                          icon={<FaPen />}
                          variant={"brand"}
                          onClick={async () => {
                            const name = await PopupManager.promptAsync({
                              title: t("rename"),
                              helperText: t("rename.helper"),
                            });

                            if (!name) return;

                            setEntities(
                              entities.map((e, i) =>
                                i === ei ? { ...e, name: name } : e
                              )
                            );
                          }}
                        />
                      </HStack>
                      <HStack justifyContent={"space-between"}>
                        <Text fontSize={"md"} textAlign={"center"}>
                          {entity.x} / {entity.y}
                        </Text>
                        <IconButton
                          size={"sm"}
                          aria-label={"edit"}
                          icon={<FaPen />}
                          variant={"brand"}
                          onClick={async () => {
                            const x = await PopupManager.promptAsync({
                              title: t("entity.x"),
                              helperText: t("entity.x.helper"),
                            });

                            if (!x) return;

                            const y = await PopupManager.promptAsync({
                              title: t("entity.y"),
                              helperText: t("entity.y.helper"),
                            });

                            if (!y) return;

                            setEntities(
                              entities.map((e, i) =>
                                i === ei
                                  ? { ...e, x: parseInt(x), y: parseInt(y) }
                                  : e
                              )
                            );
                          }}
                        />
                      </HStack>
                      {entity.type === "Lever" ? (
                        <>
                          <Text
                            textAlign={"center"}
                            fontSize={"md"}
                            fontWeight={"900"}
                            color={"brand.500"}
                          >
                            {t("properties")}
                          </Text>
                          <HStack justifyContent={"space-between"}>
                            <Text fontSize={"md"} textAlign={"center"}>
                              {t("lever.target")} ({entity.properties.target})
                            </Text>
                            <IconButton
                              size={"sm"}
                              aria-label={"edit"}
                              icon={<FaPen />}
                              variant={"brand"}
                              onClick={async () => {
                                const target = await PopupManager.selectAsync({
                                  title: t("lever.target"),
                                  choices: entities
                                    .filter((e) => e.type === "ControlUnit")
                                    .map((e) => e.name),
                                  helperText: t("lever.target.helper"),
                                });

                                if (!target) return;

                                setEntities(
                                  entities.map((e, i) =>
                                    i === ei
                                      ? {
                                          ...e,
                                          properties: {
                                            ...e.properties,
                                            target: target,
                                          },
                                        }
                                      : e
                                  )
                                );
                              }}
                            />
                          </HStack>
                        </>
                      ) : entity.type === "PathRobot" ? (
                        <>
                          <Text
                            textAlign={"center"}
                            fontSize={"md"}
                            fontWeight={"900"}
                            color={"brand.500"}
                          >
                            {t("extensions")}
                          </Text>
                          <Stack>
                            {[
                              "codeup.robots.analyzable.disable",
                              "codeup.robots.analyzable.destroy",
                            ].map((ex) => (
                              <>
                                <HStack justifyContent={"space-between"}>
                                  <Text fontSize={"md"}>{ex}</Text>
                                  <IconButton
                                    aria-label={"toggle"}
                                    icon={
                                      entity.extensions[ex] ? (
                                        <FaTimes />
                                      ) : (
                                        <FaCheck />
                                      )
                                    }
                                    colorScheme={
                                      entity.extensions[ex] ? "red" : "green"
                                    }
                                    onClick={async () => {
                                      setEntities(
                                        entities.map((e, i) =>
                                          i === ei
                                            ? {
                                                ...e,
                                                extensions: {
                                                  ...e.extensions,
                                                  [ex]: !e.extensions[ex],
                                                },
                                              }
                                            : e
                                        )
                                      );
                                    }}
                                  />
                                </HStack>
                              </>
                            ))}
                          </Stack>
                          <Text
                            textAlign={"center"}
                            fontSize={"md"}
                            fontWeight={"900"}
                            color={"brand.500"}
                          >
                            {t("properties")}
                          </Text>
                          <Stack>
                            <FormControl>
                              <FormLabel>
                                {t("robots.time.between.moves")}
                              </FormLabel>
                              <Input
                                type={"number"}
                                value={entity.properties.timeBetweenMoves}
                                onChange={(ex) => {
                                  setEntities(
                                    entities.map((e, i) =>
                                      i === ei
                                        ? {
                                            ...e,
                                            properties: {
                                              ...e.properties,
                                              timeBetweenMoves: parseInt(
                                                ex.target.value
                                              ),
                                            },
                                          }
                                        : e
                                    )
                                  );
                                }}
                              />
                            </FormControl>
                            <HStack justifyContent={"space-between"}>
                              <Text fontSize={"md"}>{t("robot.path")}</Text>
                              <IconButton
                                size={"sm"}
                                aria-label={"edit"}
                                icon={<FaPen />}
                                variant={"brand"}
                                onClick={async () => {
                                  const pathString = entity.properties.path
                                    ? entity.properties.path
                                        .map(
                                          (a: { x: number; y: number }) =>
                                            `${a.x};${a.y}`
                                        )
                                        .join("\n")
                                    : "";

                                  const newPathString =
                                    await PopupManager.promptAsync({
                                      title: t("robot.edit.path"),
                                      inputType: "TEXTAREA",
                                      defaultValue: pathString,
                                      helperText: t("robot.edit.path.helper"),
                                    });

                                  let pathObj = newPathString
                                    .split("\n")
                                    .map((a: string) => {
                                      const x = parseInt(a.split(";")[0]);
                                      const y = parseInt(a.split(";")[1]);
                                      return { x, y };
                                    });

                                  setEntities(
                                    entities.map((e, i) =>
                                      i === ei
                                        ? {
                                            ...e,
                                            properties: {
                                              ...e.properties,
                                              path: pathObj,
                                            },
                                          }
                                        : e
                                    )
                                  );
                                }}
                              />
                            </HStack>
                          </Stack>
                        </>
                      ) : entity.type === "CodeResource" ? (
                        <>
                          <HStack justifyContent={"space-between"}>
                            <Text fontSize={"md"}>{t("scripts")}</Text>
                            <IconButton
                              aria-label={"add"}
                              variant={"brand"}
                              onClick={async () => {
                                const name = await PopupManager.selectAsync({
                                  title: t("script.name"),
                                  helperText: t("script.name.helper"),
                                  choices: Object.keys(scripts as any),
                                });

                                if (!name) return;

                                const description =
                                  await PopupManager.promptAsync({
                                    title: t("script.description"),
                                    helperText: t("script.description.helper"),
                                  });

                                if (!description) return;

                                setEntities(
                                  entities.map((e, i) =>
                                    i === ei
                                      ? {
                                          ...e,
                                          properties: {
                                            ...e.properties,
                                            scripts: [
                                              ...(e.properties.scripts || []),
                                              {
                                                name,
                                                description,
                                                arguments: [],
                                              },
                                            ],
                                          },
                                        }
                                      : e
                                  )
                                );
                              }}
                              icon={<FaPlus />}
                              size={"sm"}
                            />
                          </HStack>
                          {(entity.properties.scripts || []).map(
                            (script: any, si: number) => (
                              <HStack justifyContent={"space-between"}>
                                <Text fontSize={"md"}>
                                  {script.name}: {script.description}
                                </Text>
                                <HStack>
                                  <IconButton
                                    aria-label={"edit"}
                                    variant={"brand"}
                                    onClick={async () => {
                                      const argumentString =
                                        script.arguments.join("\n");

                                      const newArgumentString =
                                        await PopupManager.promptAsync({
                                          title: t("script.arguments"),
                                          inputType: "TEXTAREA",
                                          defaultValue: argumentString,
                                          helperText: t(
                                            "script.arguments.helper"
                                          ),
                                        });

                                      if (!newArgumentString) return;

                                      const newArguments =
                                        newArgumentString.split("\n");

                                      setEntities(
                                        entities.map((e, i) =>
                                          i === ei
                                            ? {
                                                ...e,
                                                properties: {
                                                  ...e.properties,
                                                  scripts:
                                                    e.properties.scripts.map(
                                                      (s: any, j: number) =>
                                                        j === si
                                                          ? {
                                                              ...s,
                                                              arguments:
                                                                newArguments,
                                                            }
                                                          : s
                                                    ),
                                                },
                                              }
                                            : e
                                        )
                                      );
                                    }}
                                    icon={<FaPen />}
                                    size={"sm"}
                                  />
                                  <IconButton
                                    aria-label={"delete"}
                                    colorScheme={"red"}
                                    onClick={() =>
                                      setEntities(
                                        entities.map((e, i) =>
                                          i === ei
                                            ? {
                                                ...e,
                                                properties: {
                                                  ...e.properties,
                                                  scripts:
                                                    e.properties.scripts.filter(
                                                      (_: any, j: any) =>
                                                        j !== si
                                                    ),
                                                },
                                              }
                                            : e
                                        )
                                      )
                                    }
                                    icon={<FaTrash />}
                                    size={"sm"}
                                  />
                                </HStack>
                              </HStack>
                            )
                          )}
                        </>
                      ) : null}
                      <Text
                        textAlign={"center"}
                        fontSize={"md"}
                        fontWeight={"900"}
                        color={"brand.500"}
                      >
                        {t("hooks")}
                      </Text>
                      <Stack>
                        {[
                          "onWillAdd",
                          "onAdded",
                          "onWillInteract",
                          "onInteract",
                        ].map((hook) => (
                          <HStack justifyContent={"space-between"}>
                            <Text fontSize={"md"} textAlign={"center"}>
                              {hook}
                            </Text>
                            <IconButton
                              size={"sm"}
                              aria-label={"edit"}
                              icon={<FaPen />}
                              variant={"brand"}
                              onClick={async () => {
                                const script = await PopupManager.promptAsync({
                                  title: t("hook.script"),
                                  helperText: t("hook.script.helper"),
                                  // @ts-ignore
                                  defaultValue: entity.hooks[hook] as string,
                                  inputType: "TEXTAREA",
                                });

                                if (!script) return;

                                setEntities(
                                  entities.map((e, i) =>
                                    i === ei
                                      ? {
                                          ...e,
                                          hooks: { ...e.hooks, [hook]: script },
                                        }
                                      : e
                                  )
                                );
                              }}
                            />
                          </HStack>
                        ))}
                      </Stack>
                      <Button
                        colorScheme={"red"}
                        onClick={() =>
                          setEntities(entities.filter((_, i) => i !== ei))
                        }
                      >
                        {t("delete")}
                      </Button>
                    </Stack>
                  ))}
                </Grid>
                <Button
                  variant={"brand"}
                  onClick={async () => {
                    const type = await PopupManager.selectAsync({
                      title: t("entity.type"),
                      choices: [
                        "PathRobot",
                        "ControlUnit",
                        "Lever",
                        "CodeResource",
                        "Door",
                      ],
                      helperText: t("entity.type.helper"),
                    });

                    if (!type) return;

                    const name = await PopupManager.promptAsync({
                      title: t("entity.name"),
                      helperText: t("entity.name.helper"),
                    });

                    if (!name) return;

                    setEntities([
                      ...entities,
                      {
                        type: type,
                        name: name,
                        x: 0,
                        y: 0,
                        properties: {},
                        extensions: {},
                        hooks: {},
                      },
                    ]);
                  }}
                >
                  {t("add")}
                </Button>
              </TabPanel>
              <TabPanel>
                <Stack spacing={4}>
                  <Button
                    variant={"brand"}
                    onClick={async () => {
                      const json = JSON.stringify(toJSON(), null, 2);

                      Networking.download(
                        metadata!.name + ".cvlvl",
                        json,
                        "application/json"
                      );
                    }}
                  >
                    {t("export")}
                  </Button>
                </Stack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      )}
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["game"])),
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
