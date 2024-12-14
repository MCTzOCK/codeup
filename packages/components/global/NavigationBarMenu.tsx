/**
 * packages/components/global/NavigationBarMenu.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.09.2022
 *
 */
import * as React from "react";
import {
  Button,
  Grid,
  Menu,
  MenuButton,
  MenuList,
  Stack,
} from "@chakra-ui/react";
import { AiFillCaretDown } from "react-icons/ai";
import { useLoggedIn } from "@codeup/hooks";
import {
  FaBook,
  FaCaretDown,
  FaChild,
  FaCode,
  FaEnvelope,
  FaPlus,
  FaTrophy,
} from "react-icons/fa";
import { useRouter } from "next/router";
import { FaDesktop, FaFileLines, FaGavel, FaInfo } from "react-icons/fa6";
import { useTranslation } from "next-i18next";
import { FancyButton } from "./MenuButtons";
import StackedMenu from "../menu/StackedMenu";
import StackedMenuItem from "../menu/StackedMenuItem";
import { TbCertificate } from "react-icons/tb";

export default function NavigationBarMenu(props: {
  onClose: () => void;
  onOpen: () => void;
  onMoreMenuOpen: () => void;
  onLogoutOpen: () => void;
  disablePricing?: boolean;
}) {
  const { t } = useTranslation(["base", "navbar"]);

  const { loggedIn } = useLoggedIn();
  const router = useRouter();

  return (
    <>
      <StackedMenu
        trigger={
          <Button variant={"ghost"} size={"lg"}>
            {t("base:categories.learn")}
          </Button>
        }
      >
        <StackedMenuItem
          title={t("navbar:products.courses")}
          description={t("navbar:products.courses.text")}
          icon={<FaBook size={"24"} />}
          as={"a"}
          href={"/courses"}
        />
        <StackedMenuItem
          title={t("navbar:products.certificates")}
          description={t("navbar:products.certificates.text")}
          icon={<TbCertificate size={"24"} />}
          as={"a"}
          href={"/certificates"}
        />
        <StackedMenuItem
          title={t("navbar:products.challenges")}
          description={t("navbar:products.challenges.text")}
          icon={<FaTrophy size={"24"} />}
          as={"a"}
          href={"/challenges"}
        />
      </StackedMenu>
      <StackedMenu
        trigger={
          <Button variant={"ghost"} size={"lg"}>
            {t("base:categories.develop")}
          </Button>
        }
      >
        <StackedMenuItem
          title={t("navbar:products.kids")}
          description={t("navbar:products.kids.text")}
          icon={<FaChild size={"24"} />}
          as={"a"}
          href={"/kids"}
        />
        <StackedMenuItem
          title={t("navbar:products.editor")}
          description={t("navbar:products.editor.text")}
          icon={<FaCode size={"24"} />}
          as={"a"}
          href={"/editor"}
        />
        <StackedMenuItem
          title={t("navbar:products.devsuite")}
          description={t("navbar:products.devsuite.text")}
          icon={<FaCode size={"24"} />}
          as={"a"}
          href={"/projects"}
        />
        <StackedMenuItem
          title={t("navbar:products.cloud.pc")}
          description={t("navbar:products.cloud.pc.text")}
          icon={<FaDesktop size={"24"} />}
          as={"a"}
          href={"/cloud-pc/attach"}
        />
      </StackedMenu>
      <Button
        variant={"unstyled"}
        size={"lg"}
        onClick={props.onMoreMenuOpen}
        paddingInline={4}
      >
        {t("others", { ns: "navbar" })}
      </Button>
      <Button
        variant={"ghost"}
        size={"lg"}
        onClick={() => {
          router.push("/pricing");
        }}
        display={props.disablePricing ? "none" : "initial"}
      >
        {t("pricing", { ns: "navbar" })}
      </Button>
      <Menu>
        <MenuButton>
          <Button variant={"ghost"} size={"lg"}>
            {t("product.name", { ns: "base" })}
          </Button>
        </MenuButton>
        <MenuList bg={"#000"} maxWidth={"300px"}>
          <Grid templateColumns={"repeat(3, 1fr)"} gap={4} p={2}>
            <FancyButton
              icon={<FaInfo size={"24"} />}
              title={t("navbar:about.us")}
              props={{
                as: "a",
                href: "/codeup/about",
              }}
            />
            <FancyButton
              icon={<FaEnvelope size={"24"} />}
              title={t("navbar:contact")}
              props={{
                as: "a",
                href: "/codeup/contact",
              }}
            />
            <FancyButton
              icon={<FaFileLines size={"24"} />}
              title={t("navbar:products.blog")}
              props={{
                as: "a",
                href: "/blog",
              }}
            />
            <FancyButton
              icon={<FaPlus size={"24"} />}
              title={t("navbar:products.creator")}
              props={{
                as: "a",
                href: "/creator",
              }}
            />
            <FancyButton
              icon={<FaGavel size={"24"} />}
              title={t("navbar:products.legal.imprint")}
              props={{
                as: "a",
                href: "/legal/imprint",
              }}
            />
            <FancyButton
              icon={<FaGavel size={"24"} />}
              title={t("navbar:products.legal.privacy")}
              props={{
                as: "a",
                href: "/legal/privacy",
              }}
            />
          </Grid>
        </MenuList>
      </Menu>
      <Button
        variant={"ghost"}
        size={"lg"}
        display={"none"}
        onClick={() => {
          window.dispatchEvent(new CustomEvent("codeup::open_search"));
        }}
        //display={["none", "initial"]}
      >
        {t("control.search", { ns: "base" })}
      </Button>
    </>
  );
}
