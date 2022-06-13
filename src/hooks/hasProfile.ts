/**
 * src/hooks/hasProfile.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 12.06.2022
 *
 */
import {useEffect, useState} from "react";

export default function useHasProfile(id: string): { hasProfile: boolean, tried: boolean } {
    const [hasProfile, setHasProfile] = useState({
        hasProfile: false,
        tried: false,
    });

    useEffect(() => {
        fetch("/api/community/has-profile/" + id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }).then(res => {
            if (res.status === 200) {
                setHasProfile({
                    hasProfile: true,
                    tried: true,
                })
            } else {
                setHasProfile({
                    hasProfile: false,
                    tried: true,
                })
            }
        });
    }, []);

    return hasProfile;
}