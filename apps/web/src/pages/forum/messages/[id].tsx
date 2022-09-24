/**
 * apps/web/src/pages/forum/messages/[test].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.09.2022
 *
 */

import * as React from "react";
import { useRouter } from "next/router";
import ChatViewV2 from "@codeup/components/forum/ChatViewV2";
import { useEffect } from "react";

export default function MessageView() {
  const router = useRouter();

  const { id } = router.query;

  useEffect(() => {
    console.log(id);
  }, [id]);

  return (
    <>
      {id ? (
        <ChatViewV2 chatId={id as string} setActiveChat={() => {}} />
      ) : null}
    </>
  );
}
