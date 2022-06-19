/**
 * src/pages/api/community/profile/[name]/posts.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.06.2022
 *
 */


import {NextApiRequest, NextApiResponse} from "next";
import mongoConnect from "../../../../../util/mongo";
import CommunityProfileModel from "../../../../../util/models/CommunityProfileModel";
import CommunityPostModel from "../../../../../util/models/CommunityPostModel";

export default async function handleRequest(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(405).json({
            error: 'Method not allowed'
        });
        return;
    }

    const {name, from, to, count} = req.query;

    await mongoConnect();

    const profile = await CommunityProfileModel.findOne({
        username: name
    });

    if (!profile) {
        res.status(404).json({
            error: 'Not Found',
        });
        return;
    }

    const posts = await CommunityPostModel.find({
        username: name
    })

    if(!posts) {
        res.status(200).json({
            posts: [],
            success: true
        });
        return;
    }

    if(count) {
        res.status(200).json({
            postCount: posts.length,
            success: true
        });
        return;
    }

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
            res.status(200).json({
                posts: posts.reverse().slice(f2u, t2u),
                success: true
            });
            return;
        } catch (e) {
            res.status(400).json({
                error: 'Invalid range',
            });
            return;
        }
    }

    res.status(200).json({
        posts: posts.reverse(),
        success: true
    });

}