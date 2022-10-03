/**
 * src/util/generateJWT.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.06.2022
 *
 */
import jwt from "jsonwebtoken";

export default function generateJWT(user: any) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      _2fa: user.twoFactorEnabled,
      username: user.username,
      sso: user.sso || false,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "30d",
    }
  );
}
