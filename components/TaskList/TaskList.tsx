"use client"

import React from 'react'
import { NORMAL_DISTANCE, SECONDARY_DISTANCE, TASK_STATUS } from "@/lib/constants";
// import Button from '@mui/material/Button';
import { TaskModel } from "@/model/databaseType";
import "@/styles/global.css";
import clsx from "clsx";
import { PRIMARY_DISTANCE } from "@/lib/constants";
import { headerFont, subheaderFont } from "@/lib/fonts";
import NewTask from '../NewTask/NewTask';
import Card from '../Card/Card';
import NewProject from '../NewProject/NewProject';
import Chip from '@mui/material/Chip';

const statusChips = {
  NOT_STARTED : <Chip label="Not started" color="error" />,
  IN_PROGRESS : <Chip label="In progress" color="success" />,
  COMPLETED : <Chip label="Completed" color="primary" /> ,
}


const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

interface Props{
    projectId: string;
    data : TaskModel[]
}

const TaskList = ({projectId,data}: Props) => {
  return (
    <div className={clsx("column-flex-container")} style={{ gap: SECONDARY_DISTANCE }}>
        <div
          className={clsx("row-flex-container")}
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <p className={clsx("sub-header-font", subheaderFont.className)}>
            Task List
          </p>
          <div className="">
            <div style={{display:"none"}}>
              <NewProject/>
            </div>
            <NewTask mode="create" projectIdProp={projectId}/>
            </div>
        </div>
        {/* header */}
        <Card className={clsx("secondary-border-radius","row-flex-container")} styles={{gap:NORMAL_DISTANCE, alignItems:"center", justifyContent:"space-between"}}>
            <div className={clsx("extra-small-container","sub-header-font",subheaderFont.className)}>
                NAME
            </div>
            <div className={clsx("extra-small-container","sub-header-font",subheaderFont.className)}>
                DESCRIPTION
            </div>
            <div className={clsx("extra-small-container","sub-header-font",subheaderFont.className)}>
                STATUS
            </div>
            <div className={clsx("extra-small-container","sub-header-font",subheaderFont.className)}>
                DUE DATE
            </div>
            <div className={clsx("extra-small-container","sub-header-font",subheaderFont.className)}>
                UPDATED AT
            </div>
            <div className={clsx("smallest-container","sub-header-font",subheaderFont.className)} style={{textAlign:"end"}}>
                EDIT
            </div>
        </Card>
        {data && data.length ? (
          <div className={clsx("column-flex-container")} style={{gap:SECONDARY_DISTANCE}}>
            {data.map((task: TaskModel, index: number) => (
              <Card className={clsx("secondary-border-radius","row-flex-container")} styles={{gap:NORMAL_DISTANCE, alignItems:"center", justifyContent:"space-between"}} key={index}>
                <div className={clsx("extra-small-container")}>
                    {task.name}
                </div>
                <div className={clsx("extra-small-container")}>
                    {task.description}
                </div>
                <div className={clsx("extra-small-container")}>
                    {statusChips[task.status]}
                </div>
                <div className={clsx("extra-small-container")}>
                    {formatDate(task.due)}
                </div>
                <div className={clsx("extra-small-container")}>
                    {formatDate(task.updated_at)}
                </div>
                <div className={clsx("smallest-container")}>
                    <NewTask mode='update' projectIdProp={task.project_id} taskDataProp={task} />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div>no tasks</div>
        )}
        <div id="tmodal"></div>
      </div>
  )
}

export default TaskList