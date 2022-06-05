/**
 * src/pages/api/account/login.ts
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
import * as crypto from "crypto";
import jwt from "jsonwebtoken";
import * as nodemailer from "nodemailer";

export default async function handleRequest(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'POST') {
        res.status(405).json({
            error: 'Method not allowed'
        });
        return;
    }


    if (!req.body || !req.body.email || !req.body.password) {
        res.status(400).json({
            error: 'Missing required fields'
        });
        return;
    }

    await mongoConnect();

    const user = await UserModel.findOne({email: req.body.email});

    if (!user) {
        res.status(400).json({
            error: 'User not found'
        });
        return;
    }

    if(crypto.createHash('sha256').update(req.body.password).digest('hex') !== user.password) {
        res.status(400).json({
            error: 'Wrong password'
        });
        return;
    }

    if(!user.twoFactorEnabled) {
        res.status(200).json({
            error: null,
            token: generateJWT(user)
        })
        return;
    } else {
        if(req.body.code) {

            if(req.body.code === user.twoFactorCode) {
                user.twoFactorCode = null;
                await user.save();

                res.status(200).json({
                    error: null,
                    token: generateJWT(user)
                })
                return;
            } else {
                res.status(400).json({
                    error: 'Wrong code'
                });
                return;
            }

        } else {
            user.twoFactorCode = (Math.floor(Math.random() * 9000) + 1000).toString();
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
                subject: "Two Factor Authentication - Ben from CodeUp",
                text: `
                Hello ${req.body.firstName},
                
                Your two factor authentication code is: ${user.twoFactorCode}
                
                If you didn't request this, please contact support immediately at codeup@ben-siebert.de
                
                Best regards,
                Ben from CodeUp
                
            `,
            });

            res.status(200).json({
                error: null,
                _2fa: true
            })
            return;
        }
    }

}

const generateJWT = (user: any) => {
    return jwt.sign({
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
    }, process.env.JWT_SECRET as string, {
        expiresIn: '30d'
    });
};