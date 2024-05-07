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
    brand: "#F7DE1F",
    gray: {
      "100": "#C1C2C5",
      "200": "#A6A7AB",
      "300": "#909296",
      "400": "#5c5f66",
      "500": "#373A40",
      "600": "#2C2E33",
      "700": "#25262b",
      "800": "#1A1B1E",
      "900": "#141517",
    },
    red: {
      "900": "#ffe3e3",
      "800": "#ffc9c9",
      "700": "#ffa8a8",
      "600": "#ff8787",
      "500": "#ff6b6b",
      "400": "#fa5252",
      "300": "#f03e3e",
      "200": "#e03131",
      "100": "#c92a2a",
    },
    green: {
      "900": "#ebfbee",
      "800": "#d3f9d8",
      "700": "#b2f2bb",
      "600": "#8ce99a",
      "500": "#69db7c",
      "400": "#51cf66",
      "300": "#40c057",
      "200": "#37b24d",
      "100": "#2f9e44",
    },
    blue: {
      "900": "#d0ebff",
      "800": "#a5d8ff",
      "700": "#74c0fc",
      "600": "#4dabf7",
      "500": "#339af0",
      "400": "#228be6",
      "300": "#1c7ed6",
      "200": "#1971c2",
      "100": "#1864ab",
    },
    cyan: {
      "900": "#c5f6fa",
      "800": "#99e9f2",
      "700": "#66d9e8",
      "600": "#3bc9db",
      "500": "#22b8cf",
      "400": "#15aabf",
      "300": "#1098ad",
      "200": "#0c8599",
      "100": "#0b7285",
    },
    teal: {
      "100": "#e6fcf5",
      "200": "#c3fae8",
      "300": "#96f2d7",
      "400": "#63e6be",
      "500": "#38d9a9",
      "600": "#20c997",
      "700": "#12b886",
      "800": "#0ca678",
      "900": "#099268",
    },
    //black: "#101113",
    black: "#121212",
  },
  components: {
    Steps,
  },
});

export default theme;
