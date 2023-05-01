import { validateJWT } from "@/lib/auth";
import db from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await validateJWT(req.cookies[process.env.COOKIE_NAME]);

  let projectQuery="";
  let projectValues : string[] = [];

  //create a new task
  if (req.method === "POST") {
    projectQuery = `
    INSERT INTO projects (id, created_at, updated_at, owner_id, project_name, description, due, deleted)
    VALUES (uuid_generate_v4(), NOW(), NOW(), $1, $2, $3, $4, false)
  `;
    projectValues = [user.id, req.body.name,req.body.description,req.body.due];
    
    console.log("backend project create", projectValues);
  
  }

  // Update the project
if (req.method === "PUT") {
    projectQuery = `
    UPDATE projects
    SET
      project_name = $1,
      description = $2,
      updated_at = NOW(),
      due = $3
    WHERE
      id = $4
  `;

    projectValues = [
    req.body.name,
    req.body.description,
    req.body.due,
    req.body.projectId,
  ];

}

// Delete the project
if (req.method === "DELETE") {
  const projectId = req.query.projectId;

  projectQuery = `
    DELETE FROM projects
    WHERE id = $1
  `;

  projectValues = [projectId];
}


  //query database for project
  try {
    await db({ text: projectQuery, params: projectValues });
    res.json({ data: { message: "ok" } });
  } catch (error) {
    console.error("Error querying project:", error);
    res.status(500).json({ error: "Failed to do query project" });
  }
}
