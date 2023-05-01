const pg = require('pg');

// Create a connection pool
const conString = "postgresql://postgres:cQs7kk1Ds9*7@db.fcqgbrfzbdmodcpgpwyy.supabase.co:5432/postgres";
console.log("conString: " + conString);
const client = new pg.Client(conString);

const up = async function () {
    console.log("Creating test table")
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS test (
      id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      name VARCHAR(255) NOT NULL,
      age INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
  const createUserTable = `CREATE TABLE IF NOT EXISTS users(
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    email VARCHAR UNIQUE,
    password VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR
  );`

  const createProjectTable = `
  CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_name VARCHAR,
    description VARCHAR,
    due TIMESTAMP,
    deleted BOOLEAN DEFAULT false
  );`

  const createTaskTable = `
  DROP TYPE IF EXISTS task_status;
  CREATE TYPE task_status AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');
  CREATE TABLE IF NOT EXISTS task (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    status task_status DEFAULT 'NOT_STARTED',
    name VARCHAR,
    description VARCHAR,
    due TIMESTAMP,
    deleted BOOLEAN DEFAULT false
  );`

  client.connect(async function(err) {
    if(err) {
        console.log("Error connecting to database")
      return console.error('could not connect to postgres', err);
    }
    // Test table creation
    await client.query(createTableQuery, function(err, result) {
      if(err) {
        console.log("Error creating Test table query")
        return console.error('error running query', err);
      }
      console.log("Test table created successfully ",result)
    });
    // User table creation
    await client.query(createUserTable, function(err, result) {
      if(err) {
        console.log("Error creating User table query")
        return console.error('error running query', err);
      }
      console.log("User table created successfully ",result)
    });
    // Project table creation
    await client.query(createProjectTable, function(err, result) {
      if(err) {
        console.log("Error creating Project table query")
        return console.error('error running query', err);
      }
      console.log("Project table created successfully ",result)
    });
    // Task table creation
    await client.query(createTaskTable, function(err, result) {
      if(err) {
        console.log("Error creating Task table query")
        return console.error('error running query', err);
      }
      console.log("Task table created successfully ",result)
      client.end();
    });
  });

};

up()

