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
          title: "Grundlagen - Einführung in den Kurs",
          url: "/course/html-basics/basics",
        },
        {
          title: "Texte - Arten von Texten und Texte formatieren",
          url: "/course/html-basics/text",
        },
        {
          title: "Links - Links und interne Links",
          url: "/course/html-basics/links",
        },
        {
          title: "Bilder - Bilder einfügen, beschreiben und skalieren.",
          url: "/course/html-basics/image",
        },
        {
          title: "Andere Medien - Videos, Audios und Webseiten einbinden.",
          url: "/course/html-basics/other-media",
        },
        {
          title: "Listen - Arten von Listen und Einträge erstellen.",
          url: "/course/html-basics/lists",
        },
        {
          title: "Formulare - Komponenten und Formulare erstellen.",
          url: "/course/html-basics/forms",
        },
        {
          title: "Tabellen - Tabellen, Spalten, Zeilen, etc.",
          url: "/course/html-basics/tables",
        },
      ]}
    />
  );
}
