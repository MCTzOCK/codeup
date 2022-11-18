/**
 * apps/web/src/special-components/MDRenderer.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.11.2022
 *
 */

import * as React from "react";
import {
  Heading,
  Link,
  ListItem,
  OrderedList,
  UnorderedList,
} from "@chakra-ui/react";
import CodeBlock from "./CodeBlock";
import ReactMarkdown from "react-markdown";

export default function MDRenderer(props: { content: string }) {
  return (
    <>
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => <Heading size={"2xl"} {...props} />,
          h2: ({ node, ...props }) => <Heading size={"xl"} {...props} />,
          h3: ({ node, ...props }) => <Heading size={"lg"} {...props} />,
          h4: ({ node, ...props }) => <Heading size={"md"} {...props} />,
          h5: ({ node, ...props }) => <Heading size={"sm"} {...props} />,
          h6: ({ node, ...props }) => <Heading size={"xs"} {...props} />,
          ul: ({ node, ...props }) => <UnorderedList {...props} />,
          li: ({ node, ...props }) => <ListItem {...props} />,
          ol: ({ node, ...props }) => <OrderedList {...props} />,
          a: ({ node, ...props }) => (
            <Link color={"blue.500"} {...props} target={"_blank"} />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <CodeBlock
                className={className}
                allowCopy={true}
                // eslint-disable-next-line react/no-children-prop
                children={children}
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {props.content}
      </ReactMarkdown>
    </>
  );
}
