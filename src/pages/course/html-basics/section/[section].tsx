/**
 * src/pages/course/html-basics/section/[section].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.06.2022
 *
 */

import * as React from "react";
import redirect from "../../../../util/userworkflow/redirect";
import { useRouter } from "next/router";
import { useCourseProgress } from "../../../../hooks/useCourseProgress";
import { Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Section() {
  const router = useRouter();
  const [section, setSection] = useState<number>(0);

  useEffect(() => {
    redirect({
      forceAnonymous: false,
      redirectToLogin: true,
      redirectTo: router.pathname,
      allowAnonymous: false,
    });

    setSection(parseInt(router.query.section as string));
  }, [router]);

  const progress = useCourseProgress("html-basics");

  useEffect(() => {
    if (progress.loaded) {
      if (parseInt(progress.currentSection) === section) {
      } else {
        if (section > parseInt(progress.currentSection)) {
          router.push("/course/html-basics/section/" + progress.currentSection);
        }
      }
    }
  }, [progress, section]);

  return (
    <>
      <h1>{router.pathname}</h1>
      {progress.loaded ? <>{JSON.stringify(progress)}</> : <Spinner />}
    </>
  );
}

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "account",
        "navbar",
        "footer",
      ])),
    },
  };
}
