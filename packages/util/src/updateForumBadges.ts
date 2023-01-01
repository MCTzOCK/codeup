/**
 * packages/util/src/updateForumBadges.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 31.12.2022
 *
 */
import ForumPostModel from "./models/ForumPostModel";
import ForumProfileModel from "./models/ForumProfileModel";

export default async function updateForumBadges(username: any) {
  const postsOfUser = await ForumPostModel.find({ username: username });
  const profile = await ForumProfileModel.findOne({ username: username });

  const badges: {
    [key: string]: {
      name: string;
      posts: number;
    };
  } = {
    newbie: {
      name: "Newbie",
      posts: 10,
    },
    beginner: {
      name: "Beginner",
      posts: 25,
    },
    expert: {
      name: "Expert",
      posts: 50,
    },
    master: {
      name: "Master",
      posts: 100,
    },
  };

  if (profile) {
    for (const badge in badges) {
      if (postsOfUser.length >= badges[badge].posts) {
        if (!profile.badges.includes(badges[badge].name.toLowerCase())) {
          profile.badges.push(badges[badge].name.toLowerCase());
        }
      }
    }
    await profile.save();
  }
}
