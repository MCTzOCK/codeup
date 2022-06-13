/**
 * src/pages/api/community/has-profile/[name].ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 12.06.2022
 *
 */
import {NextApiRequest, NextApiResponse} from "next";
import mongoConnect from "../../../../util/mongo";
import CommunityProfileModel from "../../../../util/models/CommunityProfileModel";
import mongoose from "mongoose";


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
        const profile = await CommunityProfileModel.findOne({
            user: new mongoose.Types.ObjectId(id as string)
        })

        if (!profile) {
            res.status(404).json({
                error: 'Not Found',
                hasProfile: false
            });
            return;
        }

        res.status(200).json({
            hasProfile: true
        });
    } catch (e) {
        res.status(404).json({
            error: 'Not Found',
            hasProfile: false
        });
        return;
    }

}