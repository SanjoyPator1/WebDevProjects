import TaskCard from "@/components/TaskCard/TaskCard";
import { getUserFromCookie } from "@/lib/auth";
import db from "@/lib/db";
import {
  ProjectModel,
  ProjectWithTaskModel,
  TaskModel,
} from "@/model/databaseType";
import { cookies } from "next/headers";

//get project data
const getProjectData = async (projectId: string) => {
  const user = await getUserFromCookie(cookies());
  console.log("user from cookies in project[id] ", user);

  let projectData: ProjectModel | null = null;
  let tasksResult: TaskModel[] = [];

  //query project details
  if (projectId) {
    console.log("getting project data for owner");
    const query = `
      SELECT *
      FROM projects
      WHERE id = $1 AND owner_id = $2
    `;
    const values = [projectId, user.id];

    try {
      const result = await db({ text: query, params: values });
      projectData = result.rows[0];
    } catch (error) {
      // console.error('Error fetching project data:', error);
      throw error;
    }

    //query task details related to this project
    

    console.log("getting task details for a project data")
    const tasksQuery = `
    SELECT * FROM task
    WHERE project_id = $1`;

    const tasksValues = [projectId];

    const result = await db({ text: tasksQuery, params: tasksValues });
    tasksResult = result.rows;
  }

  // console.log({tasksResult})

  const projectDataWithTask: ProjectWithTaskModel | null = {
    ...projectData,
    tasks: tasksResult,
  };
  // console.log({projectDataWithTask})

  return projectDataWithTask;
};

export default async function ProjectPage({ params }) {
  const project = await getProjectData(params.id);

  return (
    <div style={{height:"100%"}}>
      <TaskCard projectData={project} />
    </div>
  );
}
