/**
 * apps/game/src/types.d.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.08.2024
 *
 */
import { Game } from "./Game";

declare global {
  interface Window {
    Game: Game;
    removeByName: (name: string) => void;
  }
}
