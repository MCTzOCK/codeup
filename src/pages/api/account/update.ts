/**
 * src/pages/api/account/update.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.06.2022
 *
 */

import {NextApiRequest, NextApiResponse} from "next";
import jwt from "jsonwebtoken";
import UserModel from "../../../util/models/UserModel";
import mongoConnect from "../../../util/mongo";
import generateJWT from "../../../util/generateJWT";
import {uuid} from "uuidv4";
import * as nodemailer from "nodemailer";

export default async function handleRequest(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'POST') {
        res.status(405).json({
            error: 'Method not allowed'
        });
        return;
    }

    if(!req.body || !req.body.token || !req.body.keyName || !req.body.keyValue) {
        res.status(400).json({
            error: 'Missing parameters'
        });
        return;
    }

    const token = req.body.token;

    if(jwt.verify(token, process.env.JWT_SECRET as string)) {

        const decoded = jwt.decode(token) as any;

        await mongoConnect();

        const user = await UserModel.findOne({
            _id: decoded.id
        });

        if(!user) {
            res.status(404).json({
                error: 'User not found'
            });
            return;
        }

        let allowedKeyNames = ['firstName', 'lastName', 'email', '2fa']

        if(!allowedKeyNames.includes(req.body.keyName)) {
            res.status(400).json({
                error: 'Invalid key name'
            });
            return;
        }

        let ret = true;

        switch (req.body.keyName) {
            case 'firstName':
                user.firstName = req.body.keyValue;
                break;
            case 'lastName':
                user.lastName = req.body.keyValue;
                break;
            case 'email':
                ret = false
                if(!req.body.keyValue.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                    res.status(400).json({
                        error: 'Invalid email'
                    });
                } else {
                    if(user.emailChangeCode !== "" && user.emailChangeCode !== null) {
                        res.status(400).json({
                            error: 'Email change code already sent'
                        });
                    }
                    if(await UserModel.findOne({
                        email: req.body.email
                    })) {
                        res.status(400).json({
                            error: 'Email already in use'
                        });
                    } else {
                        user.emailChangeCode = uuid();
                        user.newEmail = req.body.keyValue;

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
                            to: user.email,
                            replyTo: process.env.SMTP_USER,
                            subject: "E-Mail Change Request - Ben from CodeUp",
                            text: `
Hello ${user.firstName},

Please click the following link to confirm your email change:
http://${req.headers.host}/api/account/action?operation=changeEmail&token=${user.emailChangeCode}&redirect=${encodeURIComponent(`http://${req.headers.host}/account/settings?component=account&newToken=${generateJWT(user)}`)}

If you did not request this change, please contact the support immediately at codeup@ben-siebert.de

Best regards,
Ben from CodeUp
                
            `,
                        });

                        res.status(200).json({
                            success: true,
                            message: 'Please check your email for a verification code'
                        })
                    }
                }
                break;
            case '2fa':
                user.twoFactorEnabled = req.body.keyValue === "true";
                break;
        }

        await user.save();

        if(ret) {
            res.status(200).json({
                success: true,
                newToken: generateJWT(user)
            });
        }

    } else {
        res.status(401).json({
            error: 'Invalid token'
        });
    }
}