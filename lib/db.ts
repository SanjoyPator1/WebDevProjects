const pg = require("pg");

// Create a connection pool
const conString = process.env.DATABASE_URL;

//pool connection
const pool = new pg.Pool({
  connectionString: conString,
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000, // Time in milliseconds after which an idle connection is closed
  connectionTimeoutMillis: 2000, // Time in milliseconds to wait for a new connection
});

interface Props {
  text: string;
  params?: any[];
}

// Define a generic function to execute queries
const db = async ({ text, params }: Props) => {
  try {
    const client = await pool.connect(); // Acquire a client from the pool

    const result = await client.query(text, params); // Execute the query
    await client.release();
    return result;
  } catch (err) {
    console.error("Error executing query", err);
    throw err; // Throw the error for further handling
  } finally {
    console.log("db done");
  }
};

export default db;
