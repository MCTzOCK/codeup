/**
 * src/hooks/useUserInfo.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.06.2022
 *
 */

import jwt, {JwtPayload} from "jsonwebtoken";
import {useEffect, useState} from "react";

export default function useUserInfo(): {
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    _2fa: boolean,
} {

    const [userInfo, setUserInfo] = useState<{
        id: string,
        email: string,
        firstName: string,
        lastName: string,
        _2fa: boolean,
    }>({
        id: "",
        email: "",
        firstName: "",
        lastName: "",
        _2fa: false,
    });


    useEffect(() => {
        if(localStorage.getItem("token") !== null) {
            const token = localStorage.getItem("token") as string;
            try {
                const decoded = jwt.decode(token);
                setUserInfo(decoded as any);
            }catch(e) {
                localStorage.removeItem("token");
            }
        }
    }, []);

    return userInfo;

}