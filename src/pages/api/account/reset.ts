/**
 * src/pages/api/account/reset.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.06.2022
 *
 */

import {NextApiRequest, NextApiResponse} from "next";
import UserModel from "../../../util/models/UserModel";
import mongoConnect from "../../../util/mongo";
import generateJWT from "../../../util/generateJWT";
import {uuid} from "uuidv4";
import * as nodemailer from "nodemailer";
import sendMail from "../../../util/sendMail";

export default async function handleRequest(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'POST') {
        res.status(405).json({
            error: 'Method not allowed'
        });
        return;
    }

    if (!req.body || !req.body.email) {
        res.status(400).json({
            error: 'Missing parameters'
        });
        return;
    }

    await mongoConnect();

    const user = await UserModel.findOne({email: req.body.email});

    if (!user) {
        res.status(404).json({
            error: 'User not found'
        });
        return;
    }

    if(user.resetToken !== null && user.resetToken !== "") {
        res.status(400).json({
            error: 'Reset E-Mail already sent'
        });
        return;
    }

    const token = uuid();

    user.resetToken = token;

    await user.save();

    await sendMail(user.email, "Password Reset", `Please click on the following link to reset your password: http://${req.headers.host}/account/reset?token=${token}`, user.firstName);

    res.status(200).json({
        success: true,
        message: 'Reset E-Mail sent'
    });
}