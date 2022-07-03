/**
 * src/hooks/useCourseProgress.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 28.06.2022
 *
 */
import { useEffect, useState } from "react";

export function useCourseProgress(course: string): {
  course: string;
  started: boolean;
  currentSection: string;
  finished: boolean;
  loaded: boolean;
} {
  const [progress, setProgress] = useState<{
    course: string;
    started: boolean;
    currentSection: string;
    finished: boolean;
    loaded: boolean;
  }>({
    course: "",
    started: false,
    currentSection: "0",
    finished: false,
    loaded: false,
  });

  useEffect(() => {
    fetch("/api/course/started", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
        course: course,
      }),
    }).then((res) => {
      res.json().then((data) => {
        console.log(data);
        if (res.status === 200) {
          setProgress({
            course: course,
            started: data.progress.started,
            currentSection: data.progress.currentSection,
            finished: data.progress.finished,
            loaded: true,
          });
        } else {
          setProgress({
            course: course,
            started: false,
            currentSection: "0",
            finished: false,
            loaded: true,
          });
        }
      });
    });
  }, [course]);

  return progress;
}
