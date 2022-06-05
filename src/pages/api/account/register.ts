/**
 * src/pages/api/account/register.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.06.2022
 *
 */

import {NextApiRequest, NextApiResponse} from "next";
import mongoConnect from "../../../util/mongo";
import UserModel from "../../../util/models/UserModel";
import * as nodemailer from "nodemailer";
import * as crypto from "crypto";
import { uuid } from "uuidv4";

export default async function handleRequest(req: NextApiRequest, res: NextApiResponse) {

    if(req.method !== 'POST') {
        res.status(405).json({
            error: 'Method not allowed'
        });
        return;
    }


    if(!req.body || !req.body.email || !req.body.firstName || !req.body.lastName || !req.body.password) {
        res.status(400).json({
            error: 'Missing required fields'
        });
        return;
    }

    if(
        !req.body.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ||
        !(req.body.firstName.length > 0) ||
        !(req.body.lastName.length > 0) ||
        !req.body.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    ) {
        res.status(400).json({
            error: 'Invalid fields'
        });
        return;
    }


    await mongoConnect();


    try {

        const acToken = uuid();

        const user = await UserModel.create({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: crypto.createHash("sha256").update(req.body.password).digest("hex"),
            activationToken: acToken,
        })

        await user.save();

        let transport = nodemailer.createTransport({
            // @ts-ignore
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        await transport.sendMail({
            from: process.env.SMTP_USER,
            to: req.body.email,
            replyTo: process.env.SMTP_USER,
            subject: "Account activation - Ben from CodeUp",
            text: `
                Hello ${req.body.firstName},
                
                Please click the following link to activate your account:
                http://${req.headers.host}/api/account/action?operation=activate&token=${acToken}&redirect=http://${req.headers.host}/account/login
                
                If you did not request this email, please ignore it.
                
                Best regards,
                Ben from CodeUp
                
            `,
        });

        res.status(200).json({
            error: null,
            message: 'User created - Please check your email for an activation link'
        })

    } catch (e: any) {
        res.status(500).json({
            error: e.message
        });
        return;
    }

}