import { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";
import { comparePasswords, createJWT } from "@/lib/auth";
import { serialize } from "cookie";

export default async function signin(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {

    //find if the user exist
    const query = `
    SELECT * FROM users
    WHERE email = $1
  `;
  const values = [req.body.email];

  let user;

  try {
    const result = await db({ text: query, params: values });
    user = result.rows[0];
    console.log("user created in db ",user)
  } catch (error) {
    console.error('Error finding user:', error);
    throw error;
  }

    if (!user) {
      res.status(401);
      res.json({ error: "Invalid login" });
      return;
    }

    const isUser = await comparePasswords(req.body.password, user.password);

    if (isUser) {
      const jwt = await createJWT(user);

    //   console.log("isUser true")
    //   console.log("signing with jwt",jwt)
    //   console.log("cookie name",process.env.COOKIE_NAME)
      const cookieHeader = process.env.COOKIE_NAME
      res.setHeader(
        "Set-Cookie",
        serialize(cookieHeader, jwt,
        {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        })
      );
      res.status(201);
      res.json({data : user});
    } else {
      res.status(401);
      res.json({ error: "Invalid login" });
    }
  } else {
    res.status(402);
    res.json({});
  }
}