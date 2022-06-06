/**
 * src/pages/account/is_reset_token_valid.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.06.2022
 *
 */
import {NextApiRequest, NextApiResponse} from "next";
import mongoConnect from "../../../util/mongo";
import UserModel from "../../../util/models/UserModel";


export default async function handleRequest(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'GET') {
        res.status(405).json({
            error: 'Method not allowed'
        });
        return;
    }

    const {token} = req.query;

    if (!token) {
        res.status(400).json({
            error: 'Missing token'
        });
        return;
    }

    await mongoConnect();

    const user = await UserModel.findOne({
        resetToken: token
    });

    if (!user) {
        res.status(400).json({
            error: 'Invalid token'
        });
        return;
    }

    res.status(200).json({
        valid: true
    });

}