# MovieCritic

MovieCritic is a web application that allows users to access movie information and reviews. The project is divided into two main parts: the backend and the frontend.

## Backend

The backend of MovieCritic is built using Node.js, Express.js, TypeScript, Prisma, and Supabase. Here's a breakdown of the backend structure:

- **Technologies Used**: Node.js, Express.js, TypeScript, Prisma, Supabase.
- **Main Files**:
  - `server.ts`: Entry point for the server.
  - `app.ts`: Configuration for the Express application.
- **Folders**:
  - `src/routes`: Contains all the routes for the backend.
  - `src/controllers`: Contains the business logic for handling requests. Controllers are utilized in the routes files.
- **Database Operations**: Prisma is used for performing CRUD operations on the database.
- **Error Handling**: Appropriate edge case handling is implemented to validate inputs and provide relevant messages and status codes in the responses.
- **Running the Backend**: To run the backend, simply execute `npm install` followed by `npm run dev` on your local machine.

## Frontend

The frontend of MovieCritic is developed using React with TypeScript, Tailwind CSS, and React Query by Tanstack. Here's an overview of the frontend setup:

- **Technologies Used**: React, TypeScript, Tailwind CSS, React Query.
- **Cache Mechanism**: React Query is chosen for its efficient cache mechanism.
- **Folder Structure**:
  - `src/components`: Contains reusable components.
  - `src/pages`: Contains different pages of the application.
  - `src/models`: Defines TypeScript interfaces and types.
  - `src/services`: Provides services for interacting with the backend.
  - `src/libs`: Houses any additional libraries or utilities.
- **Running the Frontend**: To run the frontend, navigate to the frontend folder, execute `npm install`, and then `npm run dev`.

Feel free to explore :)

## Live Project

The project is live at [https://lucky-gecko-184510.netlify.app/](https://lucky-gecko-184510.netlify.app/).
