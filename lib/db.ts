const pg = require("pg");

// Create a connection pool
const conString = process.env.DATABASE_URL;

// Pool configuration options
const poolConfig = {
  connectionString: conString,
  max: 4, // Maximum number of connections
  idleTimeoutMillis: 30000, // Time in milliseconds after which an idle connection is closed
  connectionTimeoutMillis: 2000, // Time in milliseconds to wait for a new connection
};

// Create the connection pool
const pool = new pg.Pool(poolConfig);

interface Props {
  text: string;
  params?: any[];
}

// Define a generic function to execute queries
const db = async ({ text, params }: Props) => {
  let client;
  try {
    client = await pool.connect(); // Acquire a client from the pool

    const result = await client.query(text, params); // Execute the query

    return result;
  } catch (err) {
    console.error("Error executing query", err);
    throw err; // Throw the error for further handling
  } finally {
    if (client) {
      client.release(); // Release the client back to the pool
    }
    console.log("db done");
  }
};

export default db;
