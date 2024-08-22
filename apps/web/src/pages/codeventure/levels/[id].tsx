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
import { Box, Button, Flex, Tab, TabList, Tabs } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import { CHeading } from "@codeup/components/dist/global/CHeading";
import { FaSave } from "react-icons/fa";

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
        [key: string]: string;
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
    const level = res.payload.levels.find(
      (l: any) => l._id === router.query.id
    );

    if (!level) return;

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

  const saveLevel = async () => {
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

    const res = await REST.Game.updateLevel(
      AccountManager.getActiveToken(),
      router.query.id as string,
      rawLevel!.name,
      JSON.stringify(json)
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
