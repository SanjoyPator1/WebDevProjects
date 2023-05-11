import { TaskModel } from "@/model/databaseType";
import "./small-card-style.css";
import clsx from "clsx";
import NewTask from "../NewTask/NewTask";
import { NORMAL_DISTANCE } from "@/lib/constants";
import { headerFont, subheaderFont } from "@/lib/fonts";
import { format } from "date-fns";

interface Props {
  task: TaskModel;
}

const SmallTaskCard = ({ task }: Props) => {
  const statusClass = {
    NOT_STARTED: {
      label: "Not started",
      className: "status-not-started",
    },
    IN_PROGRESS: {
      label: "In progress",
      className: "status-in-progress",
    },
    COMPLETED: {
      label: "Completed",
      className: "status-complete",
    },
  };

  return (
    <div className={clsx("custom-card", statusClass[task.status].className)}>
      <div className="content-small">
        <div className="top-section-small">
          <div className={clsx("status-small")}>
            <div>{statusClass[task.status].label}</div>
          </div>
          <div
            className={clsx(
              headerFont.className,
              "header-font",
              "text-word-wrap"
            )}
          >
            {task.name}
          </div>
          <div className={clsx("description")} style={{ width: "100%" }}>
            <p className="text-ellipsis">{task.description}</p>
          </div>
        </div>

        <div className="bottom-section-small">
          <div
            className="row-flex-container"
            style={{ width: "50%", justifyContent: "space-between" }}
          >
            <div className={clsx(subheaderFont.className, "sub-header-font")}>
              CREATED :
            </div>
            <div>{format(new Date(task.created_at), "dd-MM-yy")}</div>
          </div>
          <div
            className="row-flex-container"
            style={{ width: "50%", justifyContent: "space-between" }}
          >
            <div className={clsx(subheaderFont.className, "sub-header-font")}>
              DUE :
            </div>
            <div>{format(new Date(task.due), "dd-MM-yy")}</div>
          </div>

          <div className="action-small">
            <NewTask
              mode="update"
              projectIdProp={task.project_id}
              taskDataProp={task}
              onlyIcon={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmallTaskCard;
