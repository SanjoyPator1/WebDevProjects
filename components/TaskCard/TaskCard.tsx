import { getUserFromCookie } from "@/lib/auth";
import db from "@/lib/db";
import { cookies } from "next/headers";
import Card from "@/components/Card/Card";
import { DISTANCE_CONSTANT, NORMAL_DISTANCE, SECONDARY_DISTANCE, TASK_STATUS } from "@/lib/constants";
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
    <div
      className={clsx("column-flex-container")}
      style={{ gap: DISTANCE_CONSTANT }}
    >
      <div
        className={clsx("project-details-container","top-content-container")}
      >
        {/* project name and edit project button */}
        <div className={clsx("row-flex-container")}
          style={{width:"100%", justifyContent: "space-between", alignItems: "center" }}>
          <h1 className={clsx("header-font", headerFont.className, "text-ellipsis")} style={{width:"85%"}}>{projectData.project_name}</h1>
          <div className="new-project-container" style={{width:"auto"}}>
              <NewProject mode="update"  projectDataProp={projectData}/>
            </div>
        </div>

        {/* project description and due date */}
        <div className={clsx("row-flex-container")}
          style={{width:"100%", justifyContent: "space-between", alignItems: "center", gap:"0.1rem" }}>
            <div className="" style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
              <p className={clsx(subheaderFont.className, "sub-header-font")}  style={{display:"inline"}}>DESCRIPTION : </p ><p className="text-ellipsis" style={{}}>{projectData.description}</p>
            </div>
            <div className="" style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
              <p className={clsx(subheaderFont.className, "sub-header-font")}  style={{display:"inline"}}>DUE : </p ><p className="text-ellipsis" style={{}}>{formatDate(projectData.due)}</p>
            </div>
        </div>
      </div>
      {/* task list for this project */}
      <div className="task-list-container">
        <TaskList projectData={projectData}/>
      </div>
      {/* <div id="modal"></div> */}
    </div>
  );
};

export default TaskCard;
