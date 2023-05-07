import { TaskModel } from "@/model/databaseType";
import "./color-card.css";
import clsx from "clsx";
import NewTask from "../NewTask/NewTask";
import { NORMAL_DISTANCE } from "@/lib/constants";
import { headerFont, subheaderFont } from "@/lib/fonts";
import { formatDate } from "@/lib/functions";

interface Props {
  task: TaskModel;
}

const ColorCard = ({ task }: Props) => {
  const statusClass = {
    NOT_STARTED: {
      label : "Not started",
      className: "status-not-started"
    },
    IN_PROGRESS: {
      label:"In progress",
      className:"status-in-progress",
    },
    COMPLETED: {
      label:"Completed",
      className: "status-complete"
    },
  };

  return (
    <div className={clsx("custom-card", statusClass[task.status].className)}>
      <div className="content">
        <div className="top-section">
        <div className={clsx("status")}>
          <div>
            {statusClass[task.status].label}
          </div>
        </div>
        <div className={clsx(headerFont.className, "header-font","text-word-wrap")}>
          {task.name}
        </div>
        <div className={clsx("description")} style={{width:"100%"}}>
          <p className="text-ellipsis">{task.description}</p>
        </div>
        </div>

        <div className="bottom-section">
        <div className="row-flex-container">
          <div className={clsx(subheaderFont.className, "sub-header-font")}>
            CREATED : 
          </div>
          <div>
            {formatDate(task.created_at)}
          </div>
        </div>
        <div className="row-flex-container">
          <div className={clsx(subheaderFont.className, "sub-header-font")}>
            DUE : 
          </div>
          <div>
            {formatDate(task.due)}
          </div>
        </div>
        <div className="action">
          <NewTask
            mode="update"
            projectIdProp={task.project_id}
            taskDataProp={task}
          />
        </div>
        </div>
      </div>
    </div>
  );
};

export default ColorCard;
