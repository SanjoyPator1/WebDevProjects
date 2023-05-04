"use client"

import React from 'react'
import { BLUE_COLOR, DARK_BLUE_COLOR, DARK_COLOR, DARK_GREEN_COLOR, DARK_RED_COLOR, GREEN_COLOR, LIGHT_SHADE_COLOR, NORMAL_DISTANCE, RED_COLOR, SECONDARY_DISTANCE, TASK_STATUS } from "@/lib/constants";
// import Button from '@mui/material/Button';
import { ProjectModel, ProjectWithTaskModel, TaskModel } from "@/model/databaseType";
import "@/styles/global.css";
import clsx from "clsx";
import { PRIMARY_DISTANCE } from "@/lib/constants";
import { headerFont, subheaderFont } from "@/lib/fonts";
import NewTask from '../NewTask/NewTask';
import Card from '../Card/Card';
import NewProject from '../NewProject/NewProject';
import Chip from '@mui/material/Chip';

const statusChips = {
  NOT_STARTED : <Chip  label="Not started" style={{backgroundColor: RED_COLOR, fontWeight:"bold", color: DARK_RED_COLOR}} />,
  IN_PROGRESS : <Chip label="In progress" color="success" style={{backgroundColor: BLUE_COLOR,fontWeight:"bold", color:DARK_BLUE_COLOR }}/>,
  COMPLETED : <Chip label="Completed" color="primary" style={{backgroundColor: GREEN_COLOR,fontWeight:"bold", color: DARK_GREEN_COLOR}}/> ,
}


const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

interface Props{
    projectData: ProjectWithTaskModel;
}

const TaskList = ({projectData}: Props) => {
  console.log("Task List projectData", projectData);
  const data = projectData.tasks

  return (
    <div className={clsx("column-flex-container")} style={{height:"100%"}} >
        <div
          className={clsx("row-flex-container")}
          style={{ justifyContent: "space-between", alignItems: "center", marginBottom:"2%", height:"8%" }}
        >
          <p className={clsx("sub-header-font", subheaderFont.className)}>
            Task List
          </p>
          <div className="">
            <div style={{display:"none"}}>
              <NewProject mode='update' projectDataProp={projectData}/>
            </div>
            <NewTask mode="create" projectIdProp={projectData.id}/>
            </div>
        </div>
        {/* header */}
        <Card className={clsx("secondary-border-radius","row-flex-container")} styles={{gap:NORMAL_DISTANCE, alignItems:"center", justifyContent:"space-between",backgroundColor:DARK_COLOR, height:"15%"}}>
            <div className={clsx("extra-small-container","sub-header-font",subheaderFont.className)} style={{color:"white"}}>
                NAME
            </div>
            <div className={clsx("extra-small-container","sub-header-font",subheaderFont.className)} style={{color:"white"}}>
                DESCRIPTION
            </div>
            <div className={clsx("extra-small-container","sub-header-font",subheaderFont.className)} style={{color:"white"}}>
                STATUS
            </div>
            <div className={clsx("extra-small-container","sub-header-font",subheaderFont.className)} style={{color:"white"}}>
                DUE DATE
            </div>
            <div className={clsx("extra-small-container","sub-header-font",subheaderFont.className)} style={{color:"white"}}>
                UPDATED AT
            </div>
            <div className={clsx("smallest-container","sub-header-font",subheaderFont.className)} style={{textAlign:"end", color:"white"}}>
                EDIT
            </div>
        </Card>
        {data && data.length ? (
          <div className={clsx("column-flex-container")} style={{gap:NORMAL_DISTANCE, height:"72%", overflow:"auto", flexWrap:"nowrap"}}>
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