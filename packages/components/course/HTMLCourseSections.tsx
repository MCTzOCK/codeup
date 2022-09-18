/**
 * packages/components/course/HTMLCourseSections.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.09.2022
 *
 */

import * as React from "react";
import CourseSections from "./CourseSections";

export default function HTMLCourseSections() {
  return (
    <CourseSections
      course={"HTML Basics"}
      sections={[
        {
          title: "Grundlagen",
          url: "/course/html-basics/basics",
        },
        {
          title: "Texte",
          url: "/course/html-basics/text",
        },
        {
          title: "Links",
          url: "/course/html-basics/links",
        },
        {
          title: "Bilder",
          url: "/course/html-basics/image",
        },
        {
          title: "Andere Medien",
          url: "/course/html-basics/other-media",
        },
        {
          title: "Listen",
          url: "/course/html-basics/lists",
        },
        {
          title: "Formulare",
          url: "/course/html-basics/forms",
        },
        {
          title: "Tabellen",
          url: "/course/html-basics/tables",
        },
      ]}
    />
  );
}
