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
import { FaTrash } from "react-icons/fa6";
import { useEffect } from "react";
import { Actor } from "excalibur";

export default function EntityEditor(props: { entityID: number }) {
  const [actor, setActor] = React.useState<Actor | null>(null);
  const [fields, setFields] = React.useState<
    {
      key: string;
      value: string;
      type: string;
    }[]
  >([]);

  useEffect(() => {
    let a = Game._instance.currentScene.actors.find(
      (actor) => actor.id === props.entityID
    );
    setActor(a);

    let f = Object.keys(a)
      .map((key) => {
        if (key.toUpperCase() !== key) return;
        return {
          key: key,
          value: a[key],
          type: typeof a[key],
        };
      })
      .filter((field) => field !== null && field !== undefined);

    f.push({
      key: "x",
      type: "number",
      value: a.pos.x,
    });

    f.push({
      key: "y",
      type: "number",
      value: a.pos.y,
    });

    setFields(f);
  }, [props.entityID]);

  return (
    <>
      <Popup title={actor ? actor.name : "Actor"}>
        {actor && (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const data = Object.fromEntries(formData.entries());

                for (const key in data) {
                  let d = data[key] as any;

                  if (key === "x" || key === "y") {
                    actor.pos[key] = parseFloat(d);
                    continue;
                  }

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
                <Button
                  w={"fit-content"}
                  leftIcon={<FaTrash />}
                  colorScheme={"red"}
                  isDisabled={actor.name === "PLAYER"}
                  onClick={() => {
                    Game._instance.currentScene.remove(actor);
                    UIManager.unmount();
                  }}
                >
                  Löschen
                </Button>
              </Stack>
            </form>
          </>
        )}
      </Popup>
    </>
  );
}
