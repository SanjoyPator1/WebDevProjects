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
    <GlassPane
      className={clsx("column-flex-container")}
      styles={{ gap: DISTANCE_CONSTANT, paddingBlock: DISTANCE_CONSTANT, height:"100%", width:"100%" }}
    >
      <div
        className={clsx("project-details-container")}
        style={{display:"flex", flexDirection:"column",justifyContent: "space-between", alignItems: "center", width:"100%"}}
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
          style={{width:"100%", justifyContent: "space-between", alignItems: "center" }}>
            <div className="new-project-container" style={{display:"flex", width:"100%"}}>
              <p className={clsx(subheaderFont.className)} style={{display:"inline"}}>DESCRIPTION : </p><p className="text-ellipsis" style={{flex:1}}>{projectData.description}</p>
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
      <div id="modal"></div>
    </GlassPane>
  );
};

export default TaskCard;
