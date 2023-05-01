import TaskCard from "@/components/TaskCard/TaskCard";
import { getUserFromCookie } from "@/lib/auth";
import db from "@/lib/db";
import { ProjectWithTaskModel, TaskModel } from "@/model/databaseType";
import { cookies } from "next/headers";

//get project data
const getProjectData = async (projectId:string) => {
  const user = await getUserFromCookie(cookies());
  const query = `
    SELECT *
    FROM projects
    WHERE id = $1 AND owner_id = $2
  `;
  const values = [projectId, user.id];

  let projectData;

  try {
    const result = await db({ text: query, params: values });
    projectData = result.rows[0];
  } catch (error) {
    // console.error('Error fetching project data:', error);
    throw error;
  }

  // console.log({projectData})

  const tasksQuery = `
  SELECT * FROM task
  WHERE project_id = $1`;

  const tasksValues = [projectId];

  const result = await db({ text: tasksQuery, params: tasksValues });
  const tasksResult = result.rows;

  // console.log({tasksResult})

  const projectDataWithTask : ProjectWithTaskModel = {
    ...projectData,
    tasks : tasksResult
  }

  // console.log({projectDataWithTask})

  return projectDataWithTask;
};

export default async function ProjectPage({ params }) {
  const project = await getProjectData(params.id);

  return (
    <div className="h-full overflow-y-auto pr-6 w-1/1">
      <TaskCard projectData={project} />
    </div>
  );
}
