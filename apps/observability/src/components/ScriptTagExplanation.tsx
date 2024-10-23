/**
 * apps/observability/src/components/ScriptTagExplanation.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.10.2024
 *
 */

import * as React from "react";
import { Tabs } from "@mantine/core";
import { DiHtml5 } from "react-icons/di";
import { RiNextjsFill } from "react-icons/ri";

export default function ScriptTagExplanation(props: { appId: string }) {
  return (
    <>
      <Tabs variant="pills" defaultValue="vanilla-html" mt={"lg"}>
        <Tabs.List>
          <Tabs.Tab value="vanilla-html" leftSection={<DiHtml5 />}>
            Vanilla
          </Tabs.Tab>
          <Tabs.Tab value="next.js" leftSection={<RiNextjsFill />}>
            Next.js
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="vanilla-html" mt={"md"}>
          Add the following content to the head of your HTML file:
          <pre>
            {`<script src="${window.location.origin}/api/analytics/script?appId=${props.appId}"></script>`}
          </pre>
        </Tabs.Panel>

        <Tabs.Panel value="next.js" mt={"md"}>
          Add the following content to the _app.tsx file in your Next.js
          pages-router project:
          <pre>
            {`<Script src="${window.location.origin}/api/analytics/script?appId=${props.appId}" />`}
          </pre>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
