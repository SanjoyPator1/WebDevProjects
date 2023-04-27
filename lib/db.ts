const pg = require('pg');

// Create a connection pool
const conString = "postgres://zlfncuxg:MSmF05at_m3vynrCf8hiQCI7UyZAD_de@kashin.db.elephantsql.com/zlfncuxg";
const client = new pg.Client(conString);

interface Props {
  text: string;
  params?: any[];
}

// Define a generic function to execute queries
const db = async ({ text, params }: Props) => {
  try {
    await client.connect();
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    throw error; // Throw the error for further handling
  } finally {
    await client.end();
  }
};

export default db;