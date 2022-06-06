/**
 * src/hooks/useToken.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.06.2022
 *
 */
import {useEffect, useState} from "react";
import useUserInfo from "./useUserInfo";


export default function useUserLoggedIn() {

    const [userLoggedIn, setUserLoggedIn] = useState(false);

    const userInfo = useUserInfo();

    useEffect(() => {
        setUserLoggedIn(userInfo.id !== "");
    }, [userInfo]);

    return userLoggedIn;
}