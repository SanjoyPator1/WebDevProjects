import React from "react";
import Card from "@/components/Card/Card";
import clsx from "clsx";
import "./ProjectStyle.css"
import "@/styles/global.css"
import { ProjectWithTaskModel } from "@/model/databaseType";
import { FORM_GAP, NORMAL_DISTANCE, PRIMARY_DISTANCE, SECONDARY_DISTANCE } from "@/lib/constants";
import { bodyFont, headerFont } from "@/lib/fonts";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

interface Props{
    project: ProjectWithTaskModel
}

const ProjectCard = ({ project }: Props) => {

  const completedCount = project.tasks.filter(
    (t) => t.status === "COMPLETED"
  ).length;

  
  const progress = project.tasks.length ? Math.ceil((completedCount / project.tasks.length) * 100):0;

  return (
    <Card className={clsx("project-card","secondary-border-radius")}  styles={{display:"flex", flexFlow:"column wrap",gap:PRIMARY_DISTANCE, padding: FORM_GAP, height:"100%", justifyContent:"space-between"}}>
      <div className="column-flex-container">
        <span className={clsx("body-font",bodyFont.className)}> <p style={{fontWeight:"bold", fontSize:"16px", display:"inline"}}>Created :</p> {formatDate(project.created_at)}</span>
        <span className={clsx("header-font",headerFont.className)} >{project.project_name}</span>
      </div>
      <div className="column-flex-container" style={{gap:NORMAL_DISTANCE}}>
        <span className={clsx("body-font",bodyFont.className)}>
          {completedCount}/{project.tasks.length} completed
        </span>
        <div className="progress-bar">
          <div
            className={clsx("progress-bar-fill")}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-right">
          <span className={clsx("body-font",bodyFont.className)}>{progress}%</span>
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
