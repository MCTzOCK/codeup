/**
 * src/pages/api/community/profile/toggle-follow.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.06.2022
 *
 */

import {NextApiRequest, NextApiResponse} from "next";
import mongoConnect from "../../../../../util/mongo";
import jwt from "jsonwebtoken";
import UserModel from "../../../../../util/models/UserModel";
import CommunityProfileModel from "../../../../../util/models/CommunityProfileModel";

export default async function handleRequest(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'POST') {
        res.status(405).json({
            error: 'Method not allowed'
        });
        return;
    }


    if (!req.body || !req.body.token) {
        res.status(400).json({
            error: 'Missing required fields'
        });
        return;
    }

    const {name} = req.query;

    // @ts-ignore
    jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, decoded) => {

        await mongoConnect();

        const user = await UserModel.findById((decoded as any).id);

        if(!user) {
            res.status(400).json({
                error: 'Invalid token',
            });
            return;
        }

        const profile = await CommunityProfileModel.findOne({
            username: name
        })

        if(!profile) {
            res.status(400).json({
                error: 'Profile not found',
            });
            return;
        }

        if(profile.followers.includes(user._id)) {
            profile.followers.splice(profile.followers.indexOf(user._id), 1);
        } else {
            profile.followers.push(user._id);
        }

        await profile.save();

        res.status(200).json({
            success: true,
            following: profile.followers.includes(user._id)
        });
    })
}