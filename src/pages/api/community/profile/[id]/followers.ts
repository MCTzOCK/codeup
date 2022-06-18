/**
 * src/pages/api/community/profile/followers.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.06.2022
 *
 */

import {NextApiRequest, NextApiResponse} from "next";
import mongoConnect from "../../../../../util/mongo";
import CommunityProfileModel from "../../../../../util/models/CommunityProfileModel";

export default async function handleRequest(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'GET') {
        res.status(405).json({
            error: 'Method not allowed'
        });
        return;
    }

    const {id, count, from, to} = req.query;

    if (!id) {
        res.status(400).json({
            error: 'Missing ID'
        });
        return;
    }

    await mongoConnect();

    const profile = await CommunityProfileModel.findById(id);

    if (!profile) {
        res.status(404).json({
            error: 'Not Found',
        });
        return;
    }

    if (count) {
        res.status(200).json({
            count: profile.followers.length,
            success: true
        });
        return
    }

    if (from && to) {
        res.status(200).json({
            followers: profile.followers.slice(from, to),
            success: true
        });
        return
    }

    res.status(200).json({
        followers: profile.followers,
        success: true
    });
}