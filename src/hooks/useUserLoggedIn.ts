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


export default function useUserLoggedIn() {

    const [userLoggedIn, setUserLoggedIn] = useState(false);

    useEffect(() => {
        /**
         * @TODO Validate token
         */
        setUserLoggedIn(localStorage.getItem('token') !== undefined &&
            localStorage.getItem('token') !== null);
    }, []);

    return userLoggedIn;
}