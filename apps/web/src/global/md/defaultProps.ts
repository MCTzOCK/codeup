/**
 * apps/web/src/global/md/defaultProps.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 31.05.2024
 *
 */
import {
  Code,
  Heading,
  Link,
  ListItem,
  OrderedList,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
} from "@chakra-ui/react";
import { CHeading } from "@codeup/components/dist/global/CHeading";

export const defaultMdOpts = {
  overrides: {
    h1: {
      component: CHeading,
      props: {
        size: "2xl",
      },
    },
    h2: {
      component: CHeading,
      props: {
        size: "xl",
      },
    },
    h3: {
      component: CHeading,
      props: {
        size: "lg",
      },
    },
    h4: {
      component: CHeading,
      props: {
        size: "md",
      },
    },
    h5: {
      component: CHeading,
      props: {
        size: "md",
      },
    },
    h6: {
      component: CHeading,
      props: {
        size: "md",
      },
    },
    a: {
      component: Link,
      props: {
        fontSize: "lg",
        color: "brand.500",
      },
    },
    ul: {
      component: UnorderedList,
      props: {
        fontSize: "lg",
      },
    },
    ol: {
      component: OrderedList,
      props: {
        fontSize: "lg",
      },
    },
    li: {
      component: ListItem,
      props: {
        fontSize: "lg",
      },
    },
    table: {
      component: Table,
      props: {
        fontSize: "lg",
      },
    },
    thead: {
      component: Thead,
      props: {
        fontSize: "lg",
      },
    },
    tbody: {
      component: Tbody,
      props: {
        fontSize: "lg",
      },
    },
    tr: {
      component: Tr,
      props: {
        fontSize: "lg",
      },
    },
    th: {
      component: Th,
      props: {
        fontSize: "lg",
      },
    },
    td: {
      component: Td,
      props: {
        fontSize: "lg",
      },
    },
    p: {
      component: Text,
      props: {
        fontSize: "lg",
      },
    },
    code: {
      component: Code,
      props: {
        fontSize: "lg",
      },
    },
  },
};
