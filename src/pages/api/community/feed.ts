/**
 * src/pages/api/community/feed.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.06.2022
 *
 */

import {NextApiRequest, NextApiResponse} from "next";
import jwt from "jsonwebtoken";
import mongoConnect from "../../../util/mongo";
import UserModel from "../../../util/models/UserModel";
import CommunityPostModel from "../../../util/models/CommunityPostModel";

export default async function handleRequest(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'GET') {
        res.status(405).json({
            error: 'Method not allowed'
        });
        return;
    }

    await mongoConnect();

    // in the future the feed will possibly be user specific
    // in the meantime, we'll just return the latest posts

    const {from, to, idsOnly, noReplies} = req.query;

    const posts = await CommunityPostModel.find({
        parent: noReplies ? null : {$ne: null}
    }).sort({
        createdAt: -1,
    });


    if(from && to) {

        let f2u = parseInt(from as string);
        let t2u = parseInt(to as string);

        if(f2u > t2u) {
            f2u = t2u;
            t2u = f2u;
        }

        if(f2u < 0) {
            f2u = 0;
        }

        if(t2u > posts.length) {
            t2u = posts.length;
        }

        try {
            let r = posts.slice(f2u, t2u);

            if(idsOnly) {
                r = r.map(p => p._id);
            }

            res.status(200).json({
                posts: r,
                success: true
            });
            return;
        } catch (e) {
            res.status(400).json({
                error: 'Invalid range',
            });
            return;
        }
    } else {
        res.status(400).json({
            error: 'Invalid range',
        });
        return;
    }
}