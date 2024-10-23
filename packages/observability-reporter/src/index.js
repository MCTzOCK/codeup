/**
 * packages/observability-reporter/src/index.js
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.10.2024
 *
 */
import * as rrweb from "rrweb";

//WINDOW_APP_ID
//WINDOW_CUP_URL
if (window.appId === undefined) {
  window.appId = "unknown";
}
if (window.cupURL === undefined) {
  window.cupURL = "https://observability.codeup.space";
}
fetch(window.cupURL + "/api/analytics/view?appId=" + window.appId, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    userAgent: navigator.userAgent,
    url: window.location.href,
    language: navigator.language,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
  }),
});

// Session Replay
(async () => {
  const sessionIdRes = await fetch(
    window.cupURL + "/api/analytics/get-session-id?appId=" + window.appId,
    {
      method: "GET",
    }
  );

  if (sessionIdRes.status === 200) {
    const sessionId = (await sessionIdRes.json()).sessionId;
    const events = [];
    rrweb.record({
      emit(event) {
        events.push(event);
      },
      maskInputFn: (e) => {
        return e;
      },
      collectFonts: true,
      maskAllInputs: false,
    });

    const save = async () => {
      fetch(window.cupURL + "/api/analytics/save-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          events,
        }),
      });
    };

    window.addEventListener("beforeunload", save);
    setInterval(save, 5000);
  } else {
    console.log("Failed to get session id: " + sessionIdRes.status);
  }
})();
