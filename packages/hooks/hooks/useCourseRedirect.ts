/**
 * src/hooks/useCourseRedirect.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.06.2022
 *
 */

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { default as redirect } from "@codeup/util/dist/userworkflow/redirect";
import { useCourseProgress } from "./useCourseProgress";

export default function useCourseRedirect(course: string) {
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
      if (parseInt(progress.currentSection) !== section) {
        if (section !== parseInt(progress.currentSection)) {
          router.push(
            "/course/" + course + "/section/" + progress.currentSection
          );
        }
      }
    }
  }, [progress, section]);
}
