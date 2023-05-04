import { getUserFromCookie } from "@/lib/auth";
import db from "@/lib/db";
import { cookies } from "next/headers";
import Card from "@/components/Card/Card";
import { NORMAL_DISTANCE, SECONDARY_DISTANCE, TASK_STATUS } from "@/lib/constants";
// import Button from '@mui/material/Button';
import { ProjectModel, ProjectWithTaskModel, TaskModel } from "@/model/databaseType";
import "@/styles/global.css";
import clsx from "clsx";
import { PRIMARY_DISTANCE } from "@/lib/constants";
import { headerFont, subheaderFont } from "@/lib/fonts";
import TaskList from "../TaskList/TaskList";
import GlassPane from "../GlassPane";
import NewProject from "../NewProject/NewProject";
import { formatDate } from "@/lib/functions";

interface Props {
  projectData : ProjectWithTaskModel;
}

const TaskCard = async ({projectData }: Props) => {
  

  return (
    <GlassPane
      className={clsx("column-flex-container")}
      styles={{ gap: "2%", padding: SECONDARY_DISTANCE, height:"100%" }}
    >
      <div
        className={clsx("column-flex-container ","project-details-container")}
        style={{justifyContent: "space-between", alignItems: "center", gap:NORMAL_DISTANCE }}
      >
        {/* project name and edit project button */}
        <div className={clsx("row-flex-container")}
          style={{width:"100%", justifyContent: "space-between", alignItems: "center" }}>
          <h1 className={clsx("header-font", headerFont.className)}>{projectData.project_name}</h1>
          <div className="new-project-container">
              <NewProject mode="update"  projectDataProp={projectData}/>
            </div>
        </div>

        {/* project description and due date */}
        <div className={clsx("row-flex-container")}
          style={{width:"100%", justifyContent: "space-between", alignItems: "center" }}>
            <div className="new-project-container">
              <p className={clsx(subheaderFont.className)} style={{display:"inline"}}>DESCRIPTION : </p>{projectData.description}
            </div>
            <div className="new-project-container">
              <p className={clsx(subheaderFont.className)} style={{display:"inline"}}>DUE : </p>{formatDate(projectData.due)}
            </div>
        </div>
      </div>
      {/* task list for this project */}
      <div className="task-list-container">
        <TaskList projectData={projectData}/>
      </div>
    </GlassPane>
  );
};

export default TaskCard;
