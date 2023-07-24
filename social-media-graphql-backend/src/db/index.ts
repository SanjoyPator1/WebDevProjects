import jwt from 'jsonwebtoken';
import { Low } from 'lowdb/lib';
import { JSONFile } from 'lowdb/node';
import createModel from './models'; 

interface DatabaseSchema {
  posts: any;
  users: any;
  settings: any;
}

const adapter = new JSONFile<DatabaseSchema>('src/db/db.json'); // Define the schema for LowDB
const defaultData: DatabaseSchema = { posts: [], users: [], settings: [] };
const db = new Low<DatabaseSchema>(adapter, defaultData);
db.data = defaultData;

// If you're using the synchronous version of LowDB, use LowSync instead:
// const db = new LowSync<DatabaseSchema>(adapter);
// db.data = defaultData;

export const models = {
  Settings: createModel(db, 'settings'),
  Post: createModel(db, 'posts'),
  User: createModel(db, 'users'),
};

export { db };
