import { validateJWT } from "@/lib/auth";
import db  from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(  req: NextApiRequest,
    res: NextApiResponse) {
  const user = await validateJWT(req.cookies[process.env.COOKIE_NAME]);

  const createProjectQuery = `
    INSERT INTO projects (id, created_at, updated_at, owner_id, project_name, description, due, deleted)
    VALUES (uuid_generate_v4(), NOW(), NULL, $1, $2, NULL, NULL, false)
  `;
  const createProjectValues = [
    user.id,
    req.body.name
  ];

  try {
    await db({ text: createProjectQuery, params: createProjectValues });
    res.json({ data: { message: "ok" } });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
}
