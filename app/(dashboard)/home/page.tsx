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

//get project data
const getProjectData = async () => {
  const user = await getUserFromCookie(cookies());
  const query = `
      SELECT * FROM projects
      WHERE owner_id = $1
    `;
  const values = [user?.id];
  // console.log("values", values);
  const projectsResult  = await db({ text: query, params: values });
  
  const projectIds = projectsResult.rows.map((project : ProjectWithTaskModel) => project.id);
  // console.log("projectsIDs", projectIds);
  const tasksQuery = `
  SELECT * FROM task
  WHERE project_id IN (${projectIds.map((_, i) => `$${i + 1}`).join(', ')})
  `;
  const tasksValues = projectIds;

  const tasksResult = await db({ text: tasksQuery, params: tasksValues });

    const projects = projectsResult.rows.map((project: ProjectWithTaskModel) => {
      const tasks = tasksResult.rows.filter((task:TaskModel) => task.project_id === project.id);
      return {
        ...project,
        tasks,
      };
    });

    return projects;

};

const HomePage = async () => {
  //get the project data
  const projectData : ProjectWithTaskModel[] | undefined | null = await getProjectData();
  // console.log("Project data ", projectData);
  // console.log("Task of a project ", projectData[0].tasks);

  return (
    <div className="column-flex-container" style={{ gap: PRIMARY_DISTANCE }}>

      {/* Greetings JSX */}
      <div style={{height:"150px"}}>
        <Suspense fallback={<Skeleton classNameProps="medium-container"/>}>
        <Greetings classNameProps="medium-container"/>
        </Suspense>
      </div>

      {/* All Projects Card */}
      <GlassPane styles={{padding:SECONDARY_DISTANCE}}>
        <div className="column-flex-container" style={{gap:SECONDARY_DISTANCE, maxHeight:"40%", overflow:"auto"}}>
            <div className="new-project-container">
              <NewProject />
            </div>

            <div className="card-row-flex-container" style={{gap:PRIMARY_DISTANCE, justifyContent:"space-between", padding:SECONDARY_DISTANCE}}>
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


    </div>
  );
};

export default HomePage;
