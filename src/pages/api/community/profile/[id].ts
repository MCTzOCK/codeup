/**
 * src/pages/api/community/profile/[id].ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.06.2022
 *
 */

import {NextApiRequest, NextApiResponse} from "next";
import mongoConnect from "../../../../util/mongo";
import CommunityProfileModel from "../../../../util/models/CommunityProfileModel";

export default async function handleRequest(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'GET') {
        res.status(405).json({
            error: 'Method not allowed'
        });
        return;
    }

    const {id} = req.query;

    if (!id) {
        res.status(400).json({
            error: 'Missing ID'
        });
        return;
    }

    await mongoConnect();

    try {
        const profile = await CommunityProfileModel.findById(id);

        if (!profile) {
            res.status(404).json({
                error: 'Not Found',
            });
            return;
        }

        res.status(200).json({
            profile,
            success: true
        });
    } catch (e) {
        res.status(404).json({
            error: 'Not Found',
        })
        return;
    }


}