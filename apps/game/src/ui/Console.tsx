/**
 * apps/game/src/ui/Console.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.08.2024
 *
 */

import * as React from "react";
import Popup from "./Popup";
import { UIManager } from "./UIManager";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { FaSave } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { Game } from "../Game";

export default function Console() {
  return (
    <>
      <Popup title={"Konsole"}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            try {
              eval(formData.get("command") as string);
              UIManager.unmount();
            } catch (e: any) {
              alert(e.message);
            }
          }}
        >
          <Stack spacing={4} pt={6}>
            <FormControl>
              <FormLabel color={"brand.500"} fontWeight={700}>
                Befehl
              </FormLabel>
              <Textarea
                defaultValue={'removeByName("Enemy#1")'}
                placeholder={"Befehl"}
                name={"command"}
                style={{
                  fontFamily: "monospace",
                  fontSize: "1.4rem",
                }}
              />
            </FormControl>
            <Button
              w={"fit-content"}
              leftIcon={<FaSave />}
              variant={"brand"}
              type={"submit"}
            >
              Ausführen
            </Button>
          </Stack>
        </form>
      </Popup>
    </>
  );
}
