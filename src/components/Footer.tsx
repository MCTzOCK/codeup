/**
 * src/components/Footer.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.06.2022
 *
 */

import * as React from 'react';
import {Box, Divider, Link, Text} from "@chakra-ui/react";

export default function Footer() {
    return (
        <>
            <Divider/>
            <Box w={"100%"} bg={"black"} minH={"10vh"} textAlign={"center"} paddingTop={"2rem"} paddingBlock={"2rem"}>
                <Text>CodeUp - Made by&nbsp;
                    <Link href={"https://ben-siebert.de"} isExternal color={"blue.400"}>Ben
                        Siebert</Link>&nbsp; originally created for Jugend Forscht 2023&nbsp;
                    <br/>
                    Made with ❤ and ☕
                    <br />
                    <br />
                    <Link href={"https://github.com/MCTzOCK/codeup"} isExternal color={"blue.400"}>GitHub</Link>&nbsp;
                    <Link href={"https://twitter.com/OfficialMCTzOCK"} isExternal color={"blue.400"}>Twitter</Link>
                </Text>
            </Box>
        </>
    )
}