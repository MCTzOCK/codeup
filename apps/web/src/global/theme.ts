/**
 * apps/web/src/global/theme.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.01.2023
 *
 */

import { extendTheme } from "@chakra-ui/react";
import { StepsStyleConfig as Steps } from "chakra-ui-steps";

const theme = extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: "dark",
  },
  colors: {
    "gray.100": "#C1C2C5",
    "gray.200": "#A6A7AB",
    "gray.300": "#909296",
    "gray.400": "#5c5f66",
    "gray.500": "#373A40",
    "gray.600": "#2C2E33",
    "gray.700": "#25262b",
    "gray.800": "#1A1B1E",
    "gray.900": "#141517",

    "red.900": "#ffe3e3",
    "red.800": "#ffc9c9",
    "red.700": "#ffa8a8",
    "red.600": "#ff8787",
    "red.500": "#ff6b6b",
    "red.400": "#fa5252",
    "red.300": "#f03e3e",
    "red.200": "#e03131",
    "red.100": "#c92a2a",

    "green.900": "#ebfbee",
    "green.800": "#d3f9d8",
    "green.700": "#b2f2bb",
    "green.600": "#8ce99a",
    "green.500": "#69db7c",
    "green.400": "#51cf66",
    "green.300": "#40c057",
    "green.200": "#37b24d",
    "green.100": "#2f9e44",

    "blue.900": "#d0ebff",
    "blue.800": "#a5d8ff",
    "blue.700": "#74c0fc",
    "blue.600": "#4dabf7",
    "blue.500": "#339af0",
    "blue.400": "#228be6",
    "blue.300": "#1c7ed6",
    "blue.200": "#1971c2",
    "blue.100": "#1864ab",

    "cyan.900": "#c5f6fa",
    "cyan.800": "#99e9f2",
    "cyan.700": "#66d9e8",
    "cyan.600": "#3bc9db",
    "cyan.500": "#22b8cf",
    "cyan.400": "#15aabf",
    "cyan.300": "#1098ad",
    "cyan.200": "#0c8599",
    "cyan.100": "#0b7285",

    "teal.100": "#e6fcf5",
    "teal.200": "#c3fae8",
    "teal.300": "#96f2d7",
    "teal.400": "#63e6be",
    "teal.500": "#38d9a9",
    "teal.600": "#20c997",
    "teal.700": "#12b886",
    "teal.800": "#0ca678",
    "teal.900": "#099268",
    black: "#101113",
  },
  components: {
    Steps,
  },
});

export default theme;
