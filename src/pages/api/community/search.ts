/**
 * src/pages/api/community/search.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.06.2022
 *
 */

import {NextApiRequest, NextApiResponse} from "next";
import mongoConnect from "../../../util/mongo";
import CommunityPostModel from "../../../util/models/CommunityPostModel";
import CommunityProfileModel from "../../../util/models/CommunityProfileModel";

export default async function handleRequest(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'GET') {
        res.status(405).json({
            error: 'Method not allowed'
        });
        return;
    }

    const {term} = req.query;

    if(!term) {
        res.status(400).json({
            error: 'Missing term'
        });
        return;
    }

    await mongoConnect();

    const posts = await CommunityPostModel.find({
        content: {
            $regex: term,
            $options: 'i'
        }
    });

    const profiles = await CommunityProfileModel.find({
        displayName: {
            $regex: term,
            $options: 'i'
        },
        username: {
            $regex: term,
            $options: 'i'
        }
    });

    res.status(200).json({
        posts: posts,
        profiles: profiles
    });

}