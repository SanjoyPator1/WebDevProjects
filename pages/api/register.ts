import { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";
import { createJWT, hashPassword } from "@/lib/auth";
import { serialize } from "cookie";

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {

    //create a new user
    const query = `
    INSERT INTO users (email, password, first_name, last_name)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
    const values = [
      req.body.email,
      await hashPassword(req.body.password),
      req.body.firstName,
      req.body.lastName,
    ];

    let user;

    try {
      const result = await db({ text: query, params: values });
      user = result.rows[0];
      console.log("user created in db ",user)
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }

    // console.log("prisma user created successfully", user)

    const jwt = await createJWT(user);

    console.log("jwt token registered successfully", jwt)
    const cookieHeader = process.env.COOKIE_NAME
    res.setHeader(
      "Set-Cookie",
      serialize(cookieHeader, jwt, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
    );
    console.log("jwt cookie saved successfully")
    res.status(201);
    res.json({});
  } else {
    res.status(402);
    res.json({});
  }
}
