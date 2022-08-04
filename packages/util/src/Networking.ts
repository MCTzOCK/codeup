/**
 * packages/util/src/Networking.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.07.2022
 *
 */

export default class Networking {
  public static download(
    filename: string,
    text: string,
    mimeType = "text/plain"
  ) {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:" + mimeType + ";charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  public static downloadCustom(href: string, filename: string) {
    const element = document.createElement("a");
    element.setAttribute("href", href);
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
}
