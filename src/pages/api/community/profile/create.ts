/**
 * src/pages/api/community/profile/create.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.06.2022
 *
 */

import {NextApiRequest, NextApiResponse} from "next";
import mongoConnect from "../../../../util/mongo";
import jwt from "jsonwebtoken";
import UserModel from "../../../../util/models/UserModel";
import CommunityProfileModel from "../../../../util/models/CommunityProfileModel";

export default async function handleRequest(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'POST') {
        res.status(405).json({
            error: 'Method not allowed'
        });
        return;
    }


    if (!req.body || !req.body.token || !req.body.displayName || !req.body.bio) {
        res.status(400).json({
            error: 'Missing required fields'
        });
        return;
    }

    // @ts-ignore
    jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, decoded) => {
        if(err) {
            res.status(400).json({
                error: 'Invalid token'
            });
            return;
        } else {
            await mongoConnect();
            const user = await UserModel.findOne({
                _id: ((decoded as any).id as string)
            });

            if(!user) {
                res.status(400).json({
                    error: 'User not found',
                });
                return;
            }

            const oldProfile = await CommunityProfileModel.findOne({
                user: user._id
            });

            if(oldProfile) {
                res.status(400).json({
                    error: 'Profile already exists',
                });
                return;
            }

            const profile = await CommunityProfileModel.create({
                user: user._id,
                displayName: req.body.displayName,
                bio: req.body.bio,
                username: user.username
            })

            res.status(200).json({
                profile: profile,
                success: true
            });
            return;
        }
    });

}