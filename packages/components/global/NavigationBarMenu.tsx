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
  Divider,
  Flex,
  Grid,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Menu,
  MenuButton,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { AiFillCaretDown } from "react-icons/ai";
import Link from "next/link";
import { useLoggedIn } from "@codeup/hooks";
import {
  FaCaretDown,
  FaDollarSign,
  FaEnvelope,
  FaPlus,
  FaSearch,
} from "react-icons/fa";
import DividerWithText from "./DividerWithText";
import { useRouter } from "next/router";
import { FaFileLines, FaGavel, FaInfo, FaRobot } from "react-icons/fa6";
import { useTranslation } from "next-i18next";
import { FancyButton } from "./MenuButtons";

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
      <Button
        variant={"ghost"}
        size={"lg"}
        rightIcon={<AiFillCaretDown />}
        onClick={props.onMoreMenuOpen}
      >
        {t("products", { ns: "navbar" })}
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
          <Button variant={"ghost"} size={"lg"} rightIcon={<FaCaretDown />}>
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
