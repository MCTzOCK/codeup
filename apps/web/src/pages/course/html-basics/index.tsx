/**
 * src/pages/course/javascript-basics/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.06.2022
 *
 */

import * as React from "react";
import { useEffect, useState } from "react";
import { redirect, CourseProgress } from "@codeup/util";
import { Flex, Grid, GridItem, Spinner } from "@chakra-ui/react";
import { ModuleCard, ModuleCardRow } from "@codeup/components/course";
import Xarrow from "react-xarrows";

export default function Index() {
  const [progress, setProgress] = useState<CourseProgress>({
    user: "-1",
    course: "",
    finishedModules: [],
    finishedCourse: false,
  });

  useEffect(() => {
    redirect({
      allowAnonymous: false,
      forceAnonymous: false,
      redirectToLogin: true,
    });

    fetch("/api/course/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
        course: "html-basics",
      }),
    }).then((res) => {
      res.json().then((data) => {
        if (!data.success) {
          alert("Could not fetch data");
        } else {
          setProgress({
            user: data.progress.user,
            finishedCourse: data.progress.finishedCourse,
            finishedModules: data.progress.finishedModules,
            course: data.progress.course,
          });
        }
      });
    });
  }, []);

  return (
    <>
      {progress.user === "-1" ? (
        <Spinner />
      ) : (
        <>
          <Flex w={"100%"} justifyContent={"center"}>
            <Grid
              maxW={["100%", "70%"]}
              flex={"100%"}
              margin={"2rem"}
              gridGap={["40px", "100px"]}
              column={4}
            >
              <GridItem>
                <ModuleCardRow>
                  <ModuleCard
                    title={"Basics"}
                    color={"orange.400"}
                    locked={false}
                    url={"/course/html-basics/basics"}
                    id={"mc-basics"}
                  />
                </ModuleCardRow>
              </GridItem>
              <GridItem>
                <ModuleCardRow>
                  <ModuleCard
                    title={"Text"}
                    color={"blue.500"}
                    locked={!progress.finishedModules.includes("basics")}
                    url={""}
                    id={"mc-text"}
                  />
                  <ModuleCard
                    title={"Media"}
                    color={"red.500"}
                    locked={!progress.finishedModules.includes("basics")}
                    url={""}
                    id={"mc-media"}
                  />
                </ModuleCardRow>
              </GridItem>
              <GridItem>
                <ModuleCardRow>
                  <ModuleCard
                    title={"Headlines"}
                    color={"blue.500"}
                    locked={!progress.finishedModules.includes("text")}
                    url={""}
                    id={"mc-headlines"}
                  />
                  <ModuleCard
                    title={"Links"}
                    color={"blue.500"}
                    locked={!progress.finishedModules.includes("text")}
                    url={""}
                    id={"mc-links"}
                  />
                  <ModuleCard
                    title={"Images"}
                    color={"red.500"}
                    locked={!progress.finishedModules.includes("media")}
                    url={""}
                    id={"mc-images"}
                  />
                  <ModuleCard
                    title={"Other"}
                    color={"red.500"}
                    locked={!progress.finishedModules.includes("media")}
                    url={""}
                    id={"mc-media-other"}
                  />
                </ModuleCardRow>
              </GridItem>
              <GridItem>
                <ModuleCardRow>
                  <ModuleCard
                    title={"Forms"}
                    color={"green.500"}
                    locked={
                      !progress.finishedModules.includes("headlines") &&
                      !progress.finishedModules.includes("links") &&
                      !progress.finishedModules.includes("images") &&
                      !progress.finishedModules.includes("media-other")
                    }
                    url={""}
                    id={"mc-forms"}
                  />
                </ModuleCardRow>
              </GridItem>
              <GridItem>
                <ModuleCardRow>
                  <ModuleCard
                    title={"Buttons"}
                    color={"green.500"}
                    locked={!progress.finishedModules.includes("forms")}
                    url={""}
                    id={"mc-buttons"}
                  />
                  <ModuleCard
                    title={"Inputs"}
                    color={"green.500"}
                    locked={!progress.finishedModules.includes("forms")}
                    url={""}
                    id={"mc-inputs"}
                  />
                  <ModuleCard
                    title={"Labels"}
                    color={"green.500"}
                    locked={!progress.finishedModules.includes("forms")}
                    url={""}
                    id={"mc-labels"}
                  />
                  <ModuleCard
                    title={"Submitting"}
                    color={"green.500"}
                    locked={!progress.finishedModules.includes("forms")}
                    url={""}
                    id={"mc-submitting"}
                  />
                </ModuleCardRow>
              </GridItem>
              <GridItem>
                <ModuleCardRow>
                  <ModuleCard
                    title={"Tables"}
                    color={"teal.500"}
                    locked={
                      !progress.finishedModules.includes("buttons") &&
                      !progress.finishedModules.includes("inputs") &&
                      !progress.finishedModules.includes("labels") &&
                      !progress.finishedModules.includes("submitting")
                    }
                    url={""}
                    id={"mc-tables"}
                  />
                </ModuleCardRow>
              </GridItem>
              <GridItem>
                <ModuleCardRow>
                  <ModuleCard
                    title={"Ordered Lists"}
                    color={"purple.500"}
                    locked={!progress.finishedModules.includes("tables")}
                    url={""}
                    id={"mc-lists-ordered"}
                  />
                  <ModuleCard
                    title={"Unordered Lists"}
                    color={"purple.500"}
                    locked={!progress.finishedModules.includes("tables")}
                    url={""}
                    id={"mc-lists-unordered"}
                  />
                </ModuleCardRow>
              </GridItem>
              <GridItem>
                <ModuleCardRow>
                  <ModuleCard
                    title={"Final Test"}
                    color={"blue.500"}
                    locked={
                      !progress.finishedModules.includes("basics") ||
                      !progress.finishedModules.includes("text") ||
                      !progress.finishedModules.includes("media") ||
                      !progress.finishedModules.includes("headlines") ||
                      !progress.finishedModules.includes("links") ||
                      !progress.finishedModules.includes("images") ||
                      !progress.finishedModules.includes("media-other") ||
                      !progress.finishedModules.includes("forms") ||
                      !progress.finishedModules.includes("buttons") ||
                      !progress.finishedModules.includes("inputs") ||
                      !progress.finishedModules.includes("labels") ||
                      !progress.finishedModules.includes("submitting") ||
                      !progress.finishedModules.includes("tables") ||
                      !progress.finishedModules.includes("ordered-lists") ||
                      !progress.finishedModules.includes("unordered-lists")
                    }
                    url={""}
                    id={"mc-final-test"}
                  />
                </ModuleCardRow>
              </GridItem>
            </Grid>
          </Flex>
          <Xarrows />
        </>
      )}
    </>
  );
}

function Xarrows() {
  return (
    <>
      <Xarrow
        start={"mc-basics"}
        end={"mc-text"}
        startAnchor={"bottom"}
        endAnchor={"top"}
        showHead={false}
      />
      <Xarrow
        start={"mc-basics"}
        end={"mc-media"}
        startAnchor={"bottom"}
        endAnchor={"top"}
        showHead={false}
        color={"red"}
      />
      <Xarrow
        start={"mc-text"}
        end={"mc-headlines"}
        startAnchor={"bottom"}
        endAnchor={"top"}
        showHead={false}
      />
      <Xarrow
        start={"mc-text"}
        end={"mc-links"}
        startAnchor={"bottom"}
        endAnchor={"top"}
        showHead={false}
      />
      <Xarrow
        start={"mc-media"}
        end={"mc-images"}
        startAnchor={"bottom"}
        endAnchor={"top"}
        showHead={false}
        color={"red"}
      />
      <Xarrow
        start={"mc-media"}
        end={"mc-media-other"}
        startAnchor={"bottom"}
        endAnchor={"top"}
        showHead={false}
        color={"red"}
      />
      <Xarrow
        start={"mc-headlines"}
        end={"mc-forms"}
        startAnchor={"bottom"}
        endAnchor={"top"}
        showHead={false}
        color={"green"}
      />
      <Xarrow
        start={"mc-links"}
        end={"mc-forms"}
        startAnchor={"bottom"}
        endAnchor={"top"}
        showHead={false}
        color={"green"}
      />
      <Xarrow
        start={"mc-images"}
        end={"mc-forms"}
        startAnchor={"bottom"}
        endAnchor={"top"}
        showHead={false}
        color={"green"}
      />
      <Xarrow
        start={"mc-media-other"}
        end={"mc-forms"}
        startAnchor={"bottom"}
        endAnchor={"top"}
        showHead={false}
        color={"green"}
      />
      <Xarrow
        start={"mc-forms"}
        end={"mc-buttons"}
        startAnchor={"bottom"}
        endAnchor={"top"}
        showHead={false}
        color={"green"}
      />
      <Xarrow
        start={"mc-forms"}
        end={"mc-inputs"}
        startAnchor={"bottom"}
        endAnchor={"top"}
        showHead={false}
        color={"green"}
      />
      <Xarrow
        start={"mc-forms"}
        end={"mc-labels"}
        startAnchor={"bottom"}
        endAnchor={"top"}
        showHead={false}
        color={"green"}
      />
      <Xarrow
        start={"mc-forms"}
        end={"mc-submitting"}
        startAnchor={"bottom"}
        endAnchor={"top"}
        showHead={false}
        color={"green"}
      />
      <Xarrow
        start={"mc-buttons"}
        end={"mc-tables"}
        startAnchor={"bottom"}
        endAnchor={"top"}
        showHead={false}
        color={"teal"}
      />
      <Xarrow
        start={"mc-inputs"}
        end={"mc-tables"}
        startAnchor={"bottom"}
        endAnchor={"top"}
        showHead={false}
        color={"teal"}
      />
      <Xarrow
        start={"mc-labels"}
        end={"mc-tables"}
        startAnchor={"bottom"}
        endAnchor={"top"}
        showHead={false}
        color={"teal"}
      />
      <Xarrow
        start={"mc-submitting"}
        end={"mc-tables"}
        startAnchor={"bottom"}
        endAnchor={"top"}
        showHead={false}
        color={"teal"}
      />
      <Xarrow
        start={"mc-tables"}
        end={"mc-lists-ordered"}
        startAnchor={"bottom"}
        endAnchor={"top"}
        showHead={false}
        color={"purple"}
      />
      <Xarrow
        start={"mc-tables"}
        end={"mc-lists-unordered"}
        startAnchor={"bottom"}
        endAnchor={"top"}
        showHead={false}
        color={"purple"}
      />
      <Xarrow
        start={"mc-lists-ordered"}
        end={"mc-final-test"}
        startAnchor={"bottom"}
        endAnchor={"top"}
        showHead={false}
      />
      <Xarrow
        start={"mc-lists-unordered"}
        end={"mc-final-test"}
        startAnchor={"bottom"}
        endAnchor={"top"}
        showHead={false}
      />
    </>
  );
}
