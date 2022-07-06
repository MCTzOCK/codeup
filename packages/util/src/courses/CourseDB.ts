/**
 * src/util/courses/CourseDB.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.06.2022
 *
 */
import { Course } from "./Course";

export default class CourseDB {
  public static readonly courses: Course[] = [
    {
      name: "html-basics",
      displayName: "HTML Basics",
      description:
        "In diesem Kurs lernst du die Grundlagen von HTML, was HTML ist, wofür es verwendet wird und wie du es in deinen eigenen Projekten verwenden kannst.",
      level: "Beginner",
      splashImage: "/_static/images/courses/splashes/html-basics.svg",
      colorScheme: "orange",
    },
    {
      name: "javascript-basics",
      displayName: "JavaScript Basics",
      description:
        "In diesem Kurs lernst du die Grundlagen von JavaScript, was JavaScript ist, wofür es verwendet wird und wie du es in deinen eigenen Projekten verwenden kannst.",
      level: "Beginner",
      splashImage: "/_static/images/courses/splashes/javascript-basics.svg",
      colorScheme: "yellow",
    },
  ];
}
