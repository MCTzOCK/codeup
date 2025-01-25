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
import { Button } from "@chakra-ui/react";
import {
  FaBook,
  FaCheck,
  FaChild,
  FaCode,
  FaEnvelope,
  FaLightbulb,
  FaPlus,
  FaProjectDiagram,
  FaTrophy,
} from "react-icons/fa";
import { useRouter } from "next/router";
import { FaFileLines, FaGavel, FaInfo } from "react-icons/fa6";
import { useTranslation } from "next-i18next";
import StackedMenu from "../menu/StackedMenu";
import StackedMenuItem from "../menu/StackedMenuItem";
import { TbCertificate } from "react-icons/tb";
import { BiCodeBlock } from "react-icons/bi";

export default function NavigationBarMenu(props: {
  onClose: () => void;
  onOpen: () => void;
  onMoreMenuOpen: () => void;
  onLogoutOpen: () => void;
  disablePricing?: boolean;
}) {
  const { t } = useTranslation(["base", "navbar"]);

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
          href={"/course"}
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
      </StackedMenu>
      <StackedMenu
        trigger={
          <Button
            variant={"unstyled"}
            size={"lg"}
            onClick={props.onMoreMenuOpen}
            paddingInline={4}
          >
            {t("others", { ns: "navbar" })}
          </Button>
        }
      >
        <StackedMenuItem
          title={t("navbar:products.ideas")}
          description={t("navbar:products.ideas.text")}
          icon={<FaLightbulb size={"24"} />}
          as={"a"}
          href={"/ideas"}
        />
        <StackedMenuItem
          title={t("navbar:products.tasks")}
          description={t("navbar:products.tasks.text")}
          icon={<FaCheck size={"24"} />}
          as={"a"}
          href={"/tasks"}
        />
        <StackedMenuItem
          title={t("navbar:products.flows")}
          description={t("navbar:products.flows.text")}
          icon={<FaProjectDiagram size={"24"} />}
          as={"a"}
          href={"/planning"}
        />
        <StackedMenuItem
          title={t("navbar:products.discovery")}
          description={t("navbar:products.discovery.text")}
          icon={<BiCodeBlock size={"24"} />}
          as={"a"}
          href={"/discovery"}
        />
      </StackedMenu>
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
      <StackedMenu
        trigger={
          <Button variant={"ghost"} size={"lg"}>
            {t("product.name", { ns: "base" })}
          </Button>
        }
      >
        <StackedMenuItem
          title={t("navbar:about.us")}
          description={""}
          icon={<FaInfo size={"24"} />}
          as={"a"}
          href={"/codeup/about"}
        />
        <StackedMenuItem
          title={t("navbar:contact")}
          description={""}
          icon={<FaEnvelope size={"24"} />}
          as={"a"}
          href={"/codeup/contact"}
        />
        <StackedMenuItem
          title={t("navbar:products.blog")}
          description={""}
          icon={<FaFileLines size={"24"} />}
          as={"a"}
          href={"/blog"}
        />
        <StackedMenuItem
          title={t("navbar:products.creator")}
          description={""}
          icon={<FaPlus size={"24"} />}
          as={"a"}
          href={"/creator"}
        />
        <StackedMenuItem
          title={t("navbar:products.legal.imprint")}
          description={""}
          icon={<FaGavel size={"24"} />}
          as={"a"}
          href={"/legal/imprint"}
        />
        <StackedMenuItem
          title={t("navbar:products.legal.privacy")}
          description={""}
          icon={<FaGavel size={"24"} />}
          as={"a"}
          href={"/legal/privacy"}
        />
      </StackedMenu>
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
