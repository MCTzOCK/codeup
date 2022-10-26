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
import { useEffect, useRef, useState } from "react";
import Plyr, { usePlyr } from "plyr-react";
import "plyr-react/plyr.css";

export default function VideoPlayer(props: {
  url: string;
  onEnded: () => void;
}) {
  const [hasWindow, setHasWindow] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      // @ts-ignore
      if (ref.current.plyr) {
        // @ts-ignore
        ref.current.plyr.on("pause", () => {
          console.log("pause");
        });
      }
    }
  });

  return (
    <>
      <Plyr
        ref={ref}
        source={{
          type: "video",
          title: "Intro",
          sources: [
            {
              src: props.url,
              provider: "youtube",
              size: 720,
            },
          ],
          poster: "",
          previewThumbnails: {
            src: "",
          },
          tracks: [],
        }}
        onPause={() => {
          alert("Video paused");
        }}
      />
    </>
  );
}
