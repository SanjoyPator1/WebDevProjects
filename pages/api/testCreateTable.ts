import { NextApiRequest, NextApiResponse } from 'next';
import dbHelper from '../../lib/db';

export default async function testCreateTable(req: NextApiRequest, res: NextApiResponse) {
  console.log("Creating test table")
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS testTableMotor (
      id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      name VARCHAR(255) NOT NULL,
      age INTEGER NOT NULL
    )
  `;

  const createTableParams: any[] = [];

  try {
    const result = await dbHelper({ text: createTableQuery, params: createTableParams });
    console.log('Table created successfully:', result);
    res.json({ data: result });
  } catch (error) {
    console.error('Error creating table:', error);
    res.status(500).json({ data: "error" });
  }

  
}
