import { validateJWT } from "@/lib/auth";
import db from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await validateJWT(req.cookies[process.env.COOKIE_NAME]);
  let query = "";
  let queryValues: string[] = [];

  console.log("query start in task");

  //read tasks
  if (req.method === "GET") {
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);

    query = `
    SELECT *
    FROM task
    WHERE owner_id = $1 AND due >= $2 AND due <= $3;
  `;
    queryValues = [user.id,startDate, endDate];

    console.log("trying to get task data");
    console.log({ query }, { queryValues });
  }

  //create a new task
  if (req.method === "POST") {
    query = `
    INSERT INTO task (id, created_at, updated_at, owner_id, project_id, status, name, description, due, deleted)
    VALUES (uuid_generate_v4(), NOW(), NOW(), $1, $2, $3, $4, $5, $6, false)
  `;
    queryValues = [
      user.id,
      req.body.projectId,
      req.body.status,
      req.body.name,
      req.body.description,
      req.body.due,
    ];
  }

  // Update the task
  if (req.method === "PUT") {
    query = `
    UPDATE task
    SET
      name = $1,
      description = $2,
      updated_at = NOW(),
      status = $3,
      due = $4
    WHERE
      id = $5
  `;

    queryValues = [
      req.body.name,
      req.body.description,
      req.body.status,
      req.body.due,
      req.body.taskId,
    ];
  }

  // Delete the task
  if (req.method === "DELETE") {
    const taskId = req.query.taskId;

    query = `
    DELETE FROM task
    WHERE id = $1
  `;

    queryValues = [taskId];
  }

  //query database for project
  try {
    const result = await db({ text: query, params: queryValues });
    console.log("return from be ");
    res.status(200).json(result);
  } catch (error) {
    console.error("Error querying task:", error);
    res.status(500).json({ error: "Failed to run query on task" });
  }
}
