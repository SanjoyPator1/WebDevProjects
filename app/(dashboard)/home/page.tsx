import Greetings from "@/components/Greetings/Greetings";
import ProjectCard from "@/components/ProjectCard/ProjectCard";
import Skeleton from "@/components/Skeleton/Skeleton";
import { getUserFromCookie } from "@/lib/auth";
import { NORMAL_DISTANCE, PRIMARY_DISTANCE, SECONDARY_DISTANCE } from "@/lib/constants";
import db from "@/lib/db";
import { ProjectWithTaskModel, TaskModel } from "@/model/databaseType";
import { cookies } from "next/headers";
import Link from "next/link";
import React, { Suspense } from "react";
import "@/styles/global.css"
import GlassPane from "@/components/GlassPane";
import NewProject from "@/components/NewProject/NewProject";
import TaskCard from "@/components/TaskCard/TaskCard";
import clsx from "clsx";

//get project data
const getProjectData = async () => {
  let projects : ProjectWithTaskModel[]| null= null;
  let projectIds : string[] | null = null;
  const user = await getUserFromCookie(cookies());
  const query = `
      SELECT * FROM projects
      WHERE owner_id = $1
    `;
  const values = [user?.id];
  // console.log("values", values);
  const projectsResult  = await db({ text: query, params: values });
  
  projectIds = projectsResult.rows.map((project : ProjectWithTaskModel) => project.id);
  console.log("projectsIDs", projectIds);
  if(projectIds && projectIds.length > 0){
    console.log("getting task details for all project")
    const tasksQuery = `
    SELECT * FROM task
    WHERE project_id IN (${projectIds.map((_, i) => `$${i + 1}`).join(', ')})
    `;

    const tasksValues = projectIds;

    const tasksResult = await db({ text: tasksQuery, params: tasksValues });

    projects = projectsResult.rows.map((project: ProjectWithTaskModel) => {
      const tasks = tasksResult.rows.filter((task:TaskModel) => task.project_id === project.id);
      return {
        ...project,
        tasks,
      };
    });
  }
    return projects;

};

const HomePage = async () => {
  //get the project data
  const projectData : ProjectWithTaskModel[] | undefined | null = await getProjectData();
  // console.log("Project data ", projectData);
  // console.log("Task of a project ", projectData[0].tasks);

  return (
    <div className="column-flex-container" style={{ gap: PRIMARY_DISTANCE,height:"100%" }}>

      {/* Greetings JSX */}
      <div style={{height:"18%"}}>
        <Suspense fallback={<Skeleton classNameProps="medium-container"/>}>
        <Greetings classNameProps={clsx("medium-container", "primary-border-radius")}/>
        </Suspense>
      </div>

      {/* All Projects Card */}
      <GlassPane className={clsx("primary-border-radius", "main-page-container")} styles={{padding:SECONDARY_DISTANCE, height:"78%"}}>
        <div className="column-flex-container" style={{height:"100%"}}>
            <div className="new-project-container" style={{marginRight:SECONDARY_DISTANCE}}>
              <NewProject mode="create" />
            </div>

            <div className="card-row-flex-container" style={{overflow:"auto"}}>
              {projectData && projectData.map((project : ProjectWithTaskModel) => (
                <div className="card-container" style={{}} key={project.id}>
                  <Link style={{textDecoration:"none"}} href={`/project/${project.id}`}>
                    <ProjectCard project={project} />
                  </Link>
                </div>
              ))}
            </div>

        </div>
      </GlassPane>
      
      {/* Task card - random project - top 5 */}
      {/* <GlassPane styles={{padding: `calc(${SECONDARY_DISTANCE}*2)`}}>
                <TaskCard/>
      </GlassPane> */}


    </div>
  );
};

export default HomePage;
