/**
 * /xp.js
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.07.2024
 *
 */

const xpPerLevel = (previousXP) => {
  return Math.floor(Math.pow(previousXP, 1.85) + 10);
};

const levelToXP = (level) => {
  return Math.pow(level - 10, 1 / 1.85);
};
const arr = Array.from({ length: 100 }, (_, i) => i + 1);

const xp = arr.map((level) => {
  return {
    level: level,
    xp: xpPerLevel(level),
  };
});

console.table(xp);

console.log(levelToXP(100));
