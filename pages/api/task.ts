import { validateJWT } from "@/lib/auth";
import db from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await validateJWT(req.cookies[process.env.COOKIE_NAME]);

  //create a new task
  if (req.method === "POST") {
    const createTaskQuery = `
    INSERT INTO task (id, created_at, updated_at, owner_id, project_id, status, name, description, due, deleted)
    VALUES (uuid_generate_v4(), NOW(), NOW(), $1, $2, $3, $4, $5, $6, false)
  `;
    const createTaskValues = [
      user.id,
      req.body.projectId,
      req.body.status,
      req.body.name,
      req.body.description,
      req.body.due,
    ];

    try {
      await db({ text: createTaskQuery, params: createTaskValues });
      res.json({ data: { message: "ok" } });
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ error: "Failed to create task" });
    }
  }

// Update the task
if (req.method === "PUT") {
  const updateTaskQuery = `
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

  const updateTaskValues = [
    req.body.name,
    req.body.description,
    req.body.status,
    req.body.due,
    req.body.taskId,
  ];

  try {
    await db({ text: updateTaskQuery, params: updateTaskValues });
    res.json({ data: { message: "ok" } });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
}


  // Delete the task
  if (req.method === "DELETE") {
    const taskId = req.query.taskId;
    

    const deleteTaskQuery = `
    DELETE FROM task
    WHERE id = $1
  `;

    const deleteTaskValues = [taskId];

    try {
      await db({ text: deleteTaskQuery, params: deleteTaskValues });
      res.json({ data: { message: "ok" } });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ error: "Failed to delete task" });
    }
  }
}
