/**
 * src/components/community/profile/ProfileFollowerDisplay.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.06.2022
 *
 */

import * as React from 'react';
import {useEffect, useState} from 'react';

export default function ProfileFollowerDisplay(props: {
    followers: string[]
}) {

    const [followers, setFollowers] = useState<{ avatar: string, displayName: string, bio: string }[]>([])

    useEffect(() => {
        let f = [];

        props.followers.forEach(follower => {
            fetch("/api/community/profile/" + follower + "?small=true", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json())
                .then(data => {
                    f.push({
                        avatar: data.profile.avatar,
                        displayName: data.profile.displayName,
                        bio: data.profile.bio
                    })
                })
        })

    })

    return (
        <>
            
        </>
    )
}