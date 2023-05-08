"use client";

import React from "react";
import {
  BLUE_COLOR,
  DARK_BLUE_COLOR,
  DARK_COLOR,
  DARK_GREEN_COLOR,
  DARK_RED_COLOR,
  GREEN_COLOR,
  LIGHT_SHADE_COLOR,
  NORMAL_DISTANCE,
  RED_COLOR,
  SECONDARY_DISTANCE,
  TASK_STATUS,
} from "@/lib/constants";
// import Button from '@mui/material/Button';
import {
  ProjectModel,
  ProjectWithTaskModel,
  TaskModel,
} from "@/model/databaseType";
import "@/styles/global.css";
import clsx from "clsx";
import { PRIMARY_DISTANCE } from "@/lib/constants";
import { headerFont, subheaderFont } from "@/lib/fonts";
import NewTask from "../NewTask/NewTask";
import Card from "../Card/Card";
import NewProject from "../NewProject/NewProject";
import Chip from "@mui/material/Chip";
import TiltedCard from "../TiltedCard/TiltedCard";
import { Grid } from "@mui/material";
import ColorCard from "../ColorCard/ColorCard";

const statusChips = {
  NOT_STARTED: (
    <Chip
      label="Not started"
      style={{
        backgroundColor: RED_COLOR,
        fontWeight: "bold",
        color: DARK_RED_COLOR,
      }}
    />
  ),
  IN_PROGRESS: (
    <Chip
      label="In progress"
      color="success"
      style={{
        backgroundColor: BLUE_COLOR,
        fontWeight: "bold",
        color: DARK_BLUE_COLOR,
      }}
    />
  ),
  COMPLETED: (
    <Chip
      label="Completed"
      color="primary"
      style={{
        backgroundColor: GREEN_COLOR,
        fontWeight: "bold",
        color: DARK_GREEN_COLOR,
      }}
    />
  ),
};

interface Props {
  projectData: ProjectWithTaskModel;
}

const TaskList = ({ projectData }: Props) => {
  const data = projectData.tasks;

  return (
    <div className={clsx("column-flex-container")}>
      <div
        className={clsx(
          "row-flex-container",
          "card-list-title-container",
          "new-project-container"
        )}
      >
        <p className={clsx("sub-header-font", subheaderFont.className)}>
          Task List
        </p>
        <div className="">
          <div style={{ display: "none" }}>
            <NewProject mode="update" projectDataProp={projectData} />
          </div>
          <NewTask mode="create" projectIdProp={projectData.id} />
        </div>
      </div>
      {data && data.length ? (
        <div className="card-row-flex-container">
          {data.map((task: TaskModel, index: number) => {
            return (
              <div className="card-container" key={index}>
                <ColorCard task={task} />
              </div>
            );
          })}
        </div>
      ) : (
        <div>no tasks</div>
      )}
      <div id="modal"></div>
    </div>
  );
};

export default TaskList;
