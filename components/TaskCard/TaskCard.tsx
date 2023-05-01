import { getUserFromCookie } from "@/lib/auth";
import db from "@/lib/db";
import { cookies } from "next/headers";
import Card from "@/components/Card/Card";
import { SECONDARY_DISTANCE, TASK_STATUS } from "@/lib/constants";
// import Button from '@mui/material/Button';
import { TaskModel } from "@/model/databaseType";
import "@/styles/global.css";
import clsx from "clsx";
import { PRIMARY_DISTANCE } from "@/lib/constants";
import { headerFont, subheaderFont } from "@/lib/fonts";
import TaskList from "../TaskList/TaskList";
import GlassPane from "../GlassPane";

interface Props {
  projectId: string;
  title: string;
  tasks: TaskModel[];
}

const TaskCard = async ({projectId, title, tasks }: Props) => {
  const data = tasks;

  return (
    <GlassPane
      className={clsx("column-flex-container")}
      styles={{ gap: PRIMARY_DISTANCE, padding: SECONDARY_DISTANCE, minHeight:"86vh" }}
    >
      <div
        className={clsx("row-flex-container")}
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <div>
          <h1 className={clsx("header-font", headerFont.className)}>{title}</h1>
        </div>
      </div>
      <TaskList projectId={projectId}  data={data}/>
    </GlassPane>
  );
};

export default TaskCard;
