/**
 * src/pages/api/community/profile/[name]/avatar.ts
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

export default async function handleRequest(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(405).json({
            error: 'Method not allowed'
        });
        return;
    }

    const {name} = req.query;

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

    res.redirect(profile.profilePicture);
}