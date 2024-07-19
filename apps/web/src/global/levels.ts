/**
 * apps/web/src/global/levels.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.07.2024
 *
 */

/**
 * <b style='color:red'>Legacy</b>:
 * "Einfache Code Challenge lösen (zum ersten Mal)": 5,
 * "Mittlere Code Challenge lösen (zum ersten Mal)": 7,
 * "Schwere Code Challenge lösen (zum ersten Mal)": 10,
 *
 */

export const actionMap = {
  Einloggen: 1,
  "Zertifikat mit 100 % abschließen (zum ersten Mal)": 25,
  "Projekt erstellen (CodeUp-Kids, IDE, Editor oder Dev-Suite)": 2,
  "Code-Snippet erstellen": 1,
  "ToDo-Liste erstellen": 1,
  "Mind. 5 Einträge zu einer ToDo-Liste hinzufügen (nur neue Tasks-App)": 2,
  "Flow erstellen": 1,
  "Forum-Post erstellen": 4,
  "Organisation erstellen": 1,
  "Mind. 5 Mitglieder zu einer Organisation hinzufügen": 10,
  "Forum-Post liken": 1,
} as const;
