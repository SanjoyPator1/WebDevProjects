# Project Management System with Next.js

Welcome to the project management system built with Next.js! This repository contains the source code for a project management application. Below, you will find information on how to set up and run the project, the folder structure, and the technologies used.
The main goal of this project was to learn Next.js 13 and all its new features.
I have also used postgreSQL with PG so that I can write raw queries instead of using some ORM.
There may be few bugs so please let me know if you found one.
Also I haven't spent much time on writing TypeScript as my main goal was to learn Next.js 13. Maybe later I will write the types for this project.

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/SanjoyPator1/WebDevProjects.git
2.  Navigate to the project-management branch:
    ```bash
    git switch project-management
    
3.  Install the project dependencies:
    ```bash
    npm install
    
4.  Create a `.env` file in the root directory of the project with the following environmental variables:
    `JWT_SECRET=your-secret-key,
    COOKIE_NAME=your-cookie-name,
    DATABASE_URL=your-database-url` 
    
    -   `JWT_SECRET`: This is the secret key used to create and verify JWT tokens for authentication.
    -   `COOKIE_NAME`: The name used to store the JWT token as a cookie for authentication.
    -   `DATABASE_URL`: Provide the URL for your PostgreSQL database. You can use a local database or a cloud-based solution like Supabase or ElephantDB.

## Folder Structure

The project's folder structure is organized as follows:

-   `app/`: This directory contains the Next.js pages for the application. Each folder with `.ts` or `.tsx` file in this directory represents a route in the application.
    
-   `components/`: This directory contains reusable React components used throughout the project.
    
-   `lib/`: The `lib` directory contains utility functions, configurations, and the database migration script.
    
-   `public/`: This directory is where you can place static assets like images, fonts, and CSS files.
    
-   `global.css`: You'll find global CSS stylesheets and utility classes in this directory.
    

## Database Migration

Since this project uses PostgreSQL for database operations without the help of any ORM, you need to manually perform database migration steps.

To perform the migration, follow these steps:

1.  Navigate to the `lib/` directory:
    
    ```bash
    cd lib` 
    
2.  In the `migration.js` file, update the `constring` variable with your database URL.
    
3.  In the project's root directory, you will find a migration command in the `package.json` file:
    
    ```json
    "scripts": {
      "migrate": "node ./lib/migration.js"
    }
    
4.  To create the necessary tables, run the migration command in your terminal:
    ```bash
    npm run migrate` 
    

## Running the Project

After completing the database migration, you can start the project by running the following command:
`npm run dev` 

The project will start locally, and you can access it in your web browser at `http://localhost:3000`.

That's it! You now have the project management system up and running on your local machine. Feel free to explore the codebase, make changes, and customize it to suit your needs. Good luck with your project!
