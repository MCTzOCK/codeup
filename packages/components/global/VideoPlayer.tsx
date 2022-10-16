/**
 * packages/components/global/VideoPlayer.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.10.2022
 *
 */

import * as React from "react";
import { useEffect, useState } from "react";
import Plyr from "plyr-react";
import "plyr-react/plyr.css"

export default function VideoPlayer(props: {
  url: string;
}) {

  const [hasWindow, setHasWindow] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  return (
    <>
      {
        hasWindow && (
          <>
            <Plyr source={{
              type: 'video',
              title: 'Intro',
              sources: [
                {
                  src: props.url,
                  provider: 'youtube',
                  size: 720,
                },
              ],
              poster: '',
              previewThumbnails: {
                src: '',
              },
              tracks: [
              ],
            }} />
          </>
        )
      }
    </>
  );
}