/**
 * src/util/courses/CourseDB.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.06.2022
 *
 */
import {Course} from "./Course";

export default class CourseDB {

    public static readonly courses: Course[] = [
        {
            name: "html-basics",
            displayName: "HTML Basics",
            description: "In this course you will learn the basics of HTML. You will learn what HTML is, what it's used for and how to use it in your own projects.",
            level: "Beginner",
            splashImage: "/_static/images/courses/splashes/html-basics.svg",
            colorScheme: "orange"
        },
        {
            name: "javascript-basics",
            displayName: "JavaScript Basics",
            description: "In this course you will learn the basics of JavaScript. You will learn what JavaScript is, what it's used for and how to use it in your own projects.",
            level: "Beginner",
            splashImage: "/_static/images/courses/splashes/javascript-basics.svg",
            colorScheme: "yellow"
        }
    ]

}
