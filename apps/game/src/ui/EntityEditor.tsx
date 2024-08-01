/**
 * apps/game/src/ui/EntityEditor.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.08.2024
 *
 */

import * as React from "react";
import { Game } from "../Game";
import Popup from "./Popup";
import { FormControl, FormLabel, Stack, Input, Button } from "@chakra-ui/react";
import { FaSave } from "react-icons/fa";
import { UIManager } from "./UIManager";

export default function EntityEditor(props: { entityID: number }) {
  const actor = Game._instance.currentScene.actors.find(
    (actor) => actor.id === props.entityID
  );

  const fields = Object.keys(actor)
    .map((key) => {
      if (key.toUpperCase() !== key) return;
      return {
        key: key,
        value: actor[key],
        type: typeof actor[key],
      };
    })
    .filter((field) => field !== null && field !== undefined);

  return (
    <>
      <Popup title={actor.name}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const data = Object.fromEntries(formData.entries());

            for (const key in data) {
              let d = data[key] as any;

              if (fields.find((f) => f.key === key).type === "number") {
                if (typeof d === "string") {
                  d = parseFloat(d);
                }
              }

              actor[key] = d;
            }

            UIManager.unmount();
          }}
        >
          <Stack spacing={4} pt={6}>
            {fields.map((field) => {
              return (
                <>
                  <FormControl>
                    <FormLabel color={"brand.500"} fontWeight={700}>
                      {field.key}
                    </FormLabel>
                    <Input
                      defaultValue={field.value}
                      placeholder={field.value}
                      name={field.key}
                    />
                  </FormControl>
                </>
              );
            })}
            <Button
              w={"fit-content"}
              leftIcon={<FaSave />}
              variant={"brand"}
              type={"submit"}
            >
              Speichern
            </Button>
          </Stack>
        </form>
      </Popup>
    </>
  );
}
