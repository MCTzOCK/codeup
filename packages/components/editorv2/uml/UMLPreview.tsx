/**
 * packages/components/editorv2/uml/UMLPreview.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.06.2024
 *
 */

import * as React from "react";
import AuthenticateLoadingIndicator from "../../admin/AuthenticateLoadingIndicator";
import { DiagramModule } from "@brainstack/diagram";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Select,
} from "@chakra-ui/react";
import Networking from "@codeup/util/dist/Networking";

export default function UMLPreview(props: { umlData: string }) {
  DiagramModule.setConfig({
    baseUrl: "https://uml.ben-siebert.com",
  });

  if (!props.umlData)
    return (
      <>
        <AuthenticateLoadingIndicator text={"Lade Vorschau..."} />
      </>
    );

  const [url, setUrl] = React.useState<string>("");
  const [theme, setTheme] = React.useState<string>("toy");

  React.useEffect(() => {
    setUrl(DiagramModule.generate_svg(props.umlData + "\n!theme " + theme));
  }, [props.umlData, theme]);

  return (
    <>
      <FormControl>
        <FormLabel>Theme</FormLabel>
        <Select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="black-knight">Black-Knight</option>
          <option value="spacelab">Spacelab</option>
          <option value="blueprint">Blueprint</option>
          <option value="toy">Toy</option>
          <option value="vibrant">Vibrant</option>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Herunterladen</FormLabel>
        <Flex gap={2} direction={["column", "column", "row"]}>
          {["png", "svg", "txt", "uml"].map((type) => (
            <>
              <Button
                variant={"brand"}
                onClick={() => {
                  const c = props.umlData + "\n!theme " + theme;
                  switch (type) {
                    case "png":
                      window.open(DiagramModule.generate_png(c));
                      break;
                    case "svg":
                      window.open(DiagramModule.generate_svg(c));
                      break;
                    case "txt":
                      window.open(DiagramModule.generate_txt(c));
                      break;
                    case "uml":
                      Networking.download("data.uml", c, "text/plain");
                      break;
                  }
                }}
              >
                .{type}
              </Button>
            </>
          ))}
        </Flex>
      </FormControl>
      <Image
        src={url}
        width={"100%"}
        maxW={"600px"}
        bg={"#FFF"}
        mt={4}
        rounded={"xl"}
        crossOrigin={""}
      />
    </>
  );
}
