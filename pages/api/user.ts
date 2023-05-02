import { validateJWT } from "@/lib/auth";
import db from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await validateJWT(req.cookies[process.env.COOKIE_NAME]);

  let query="";
  let queryValues : string[] = [];

  // Update the profile
if (req.method === "PUT") {
    query = `
    UPDATE users
    SET
        updated_at = NOW(),
        first_name = $1,
        last_name = $2,
        email=$3
    WHERE
      id = $4
  `;

    queryValues = [
    req.body.firstName,
    req.body.lastName,
    req.body.email,
    user.id
    ];

    console.log("queryValues user: ",queryValues)

}

// // Delete the project
// if (req.method === "DELETE") {
//   const projectId = req.query.projectId;

//   query = `
//     DELETE FROM projects
//     WHERE id = $1
//   `;

//   queryValues = [projectId];
// }


  //query database for project
  try {
    const result = await db({ text: query, params: queryValues });
    res.json(result);
  } catch (error) {
    console.error("Error querying project:", error);
    res.status(500).json({ error: "Failed to do query project" });
  }
}
