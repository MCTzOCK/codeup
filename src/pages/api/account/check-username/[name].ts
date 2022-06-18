/**
 * src/pages/api/account/check-username/[name].ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.06.2022
 *
 */

import {NextApiRequest, NextApiResponse} from "next";
import mongoConnect from "../../../../util/mongo";
import UserModel from "../../../../util/models/UserModel";

export default async function handleRequest(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'GET') {
        res.status(405).json({
            error: 'Method not allowed'
        });
        return;
    }

    const {name} = req.query;

    if (!name) {
        res.status(400).json({
            error: 'Missing name'
        });
        return;
    }

    await mongoConnect();

    const user = await UserModel.findOne({
        username: name as string
    })

    if(!user) {
        res.status(200).json({
            error: "Username available"
        })
        return;
    }

    res.status(400).json({
        error: "Username taken"
    })

}