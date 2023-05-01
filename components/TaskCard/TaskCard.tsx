import { getUserFromCookie } from "@/lib/auth";
import db from "@/lib/db";
import { cookies } from "next/headers";
import Card from "@/components/Card/Card";
import { SECONDARY_DISTANCE, TASK_STATUS } from "@/lib/constants";
// import Button from '@mui/material/Button';
import { ProjectModel, ProjectWithTaskModel, TaskModel } from "@/model/databaseType";
import "@/styles/global.css";
import clsx from "clsx";
import { PRIMARY_DISTANCE } from "@/lib/constants";
import { headerFont, subheaderFont } from "@/lib/fonts";
import TaskList from "../TaskList/TaskList";
import GlassPane from "../GlassPane";
import NewProject from "../NewProject/NewProject";

interface Props {
  projectData : ProjectWithTaskModel;
}

const TaskCard = async ({projectData }: Props) => {
  

  return (
    <GlassPane
      className={clsx("column-flex-container")}
      styles={{ gap: PRIMARY_DISTANCE, padding: SECONDARY_DISTANCE, minHeight:"86vh" }}
    >
      <div
        className={clsx("row-flex-container")}
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <div className={clsx("row-flex-container")}
          style={{width:"100%", justifyContent: "space-between", alignItems: "center" }}>
          <h1 className={clsx("header-font", headerFont.className)}>{projectData.project_name}</h1>
          <div className="new-project-container">
              <NewProject mode="update"  projectDataProp={projectData}/>
            </div>
        </div>
      </div>
      <TaskList projectData={projectData}/>
    </GlassPane>
  );
};

export default TaskCard;
