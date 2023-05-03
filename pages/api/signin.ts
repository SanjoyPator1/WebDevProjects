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

  console.log("be api user values",req.body.email,req.body.password);

  let result;
  let user;

  try {
    result = await db({ text: query, params: values });
    user = result.rows[0];
  } catch (error) {
    //401 status code : unauthorized
    res.status(401);
    res.json({message:"Something went wrong while getting user" });
  }

    if (!user) {
      //401 status code : unauthorized
      res.status(401);
      res.json({ message:"User not found" });
      return;
    }

    const isUser = user && await comparePasswords(req.body.password, user.password);

    if (isUser) {
      const jwt = await createJWT(user);
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
      res.json({...result, message:"Successfully Logged in"});
    } else {
      // 401 status code : unauthorized
      res.status(401);
      res.json({ message:"Invalid passwords" });
    }
  } else {
    res.status(400);
    res.json({ message:"Something went wrong"});
  }
}