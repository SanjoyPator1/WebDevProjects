# OAuth Auth Service

## Running the Project with Docker Compose

1. **Build and start the database and app:**

   ```sh
   docker-compose up --build db app
   ```

   This will start the PostgreSQL database and the FastAPI app. The app will be available at http://localhost:8000.

2. **Run Alembic migrations:**

   ```sh
   docker-compose run --rm migrate
   ```

   This will run all Alembic migrations to bring your database schema up to date. You should run this command after starting the database and before starting the app in production, or whenever you add new migrations.

3. **(Optional) Start all services together (for development):**
   ```sh
   docker-compose up --build
   ```
   This will start db, app, and the migrate service. The migrate service will run once and exit.

## Making Schema Changes

1. **Generate a new migration after changing models:**

   ```sh
   docker-compose run --rm app uv run alembic revision --autogenerate -m "Describe your change"
   ```

   This will create a new migration file in `alembic/versions/`.

2. **Apply the migration:**
   ```sh
   docker-compose run --rm migrate
   ```

## Production Workflow

- In production, always run the migration step (`docker-compose run --rm migrate`) before starting the app service. This ensures your database schema is up to date before the app starts handling requests.

## Environment Variables

- The app and migration services use environment variables for configuration. See `.env.example` for required variables.

---

For more details, see the code and configuration files in this repository.

