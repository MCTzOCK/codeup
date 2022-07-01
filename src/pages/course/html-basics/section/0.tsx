/**
 * src/pages/course/html-basics/section/0.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.06.2022
 *
 */

import * as React from "react";
import useCourseRedirect from "../../../../hooks/useCourseRedirect";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import CourseLayout from "../../../../components/course/CourseLayout";
import CourseTitle from "../../../../components/course/CourseTitle";

export default function Section() {
  useCourseRedirect("html-basics");
  const { t } = useTranslation();
  return (
    <>
      <CourseLayout>
        <CourseTitle
          course={t("course:html-basics")}
          section={0}
          sectionTitle={t("html-basics_0:title")}
        />
      </CourseLayout>
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
        "html-basics_0",
        "course",
      ])),
    },
  };
}
