/**
 * packages/util/src/userworkflow/xp.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.07.2024
 *
 */
import UserXPModel from "../models/UserXPModel";

export const addXP = async (
  userId: string,
  xp: number,
  reason: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const userXpMod = await UserXPModel.findOne({ user: userId });

    if (userXpMod) {
      const newXP = userXpMod.xp + xp;
      const newLevel = Math.round(newXP ** (1 / 3));

      if (newLevel > userXpMod.level) {
        userXpMod.level = newLevel;
      }

      userXpMod.xp = newXP;

      userXpMod.transactions.push({
        xp,
        reason,
        createdAt: new Date(),
      });

      await userXpMod.markModified("transactions");

      await userXpMod.save();

      return {
        message: "XP added",
        success: true,
      };
    }

    const newUserXpMod = await UserXPModel.create({
      user: userId,
      level: Math.round(xp ** (1 / 3)),
      xp,
      transactions: [
        {
          xp,
          reason,
          createdAt: new Date(),
        },
      ],
    });

    await newUserXpMod.save();

    return {
      message: "XP added",
      success: true,
    };
  } catch (e: any) {
    return {
      success: false,
      message: e.message,
    };
  }
};

export const getLevelProgress = async (
  userId: string
): Promise<{
  level: number;
  xp: number;
  xpNeeded: number;
}> => {
  try {
    const userXpMod = await UserXPModel.findOne({ user: userId });

    if (userXpMod) {
      return {
        level: userXpMod.level,
        xp: userXpMod.xp,
        xpNeeded: (userXpMod.level + 1) ** 3,
      };
    }

    return {
      level: 0,
      xp: 0,
      xpNeeded: 1,
    };
  } catch {
    return {
      level: 0,
      xp: 0,
      xpNeeded: 1,
    };
  }
};
