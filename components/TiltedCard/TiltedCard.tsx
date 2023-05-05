import { TaskModel } from "@/model/databaseType";
import "./tiltedCardStyle.css";
import clsx from "clsx";
import NewTask from "../NewTask/NewTask";
import { NORMAL_DISTANCE } from "@/lib/constants";


interface Props {
    task: TaskModel
}

const TiltedCard = ({task}: Props) => {

    const statusClass = {
        NOT_STARTED : "status-not-started",
        IN_PROGRESS : "status-in-progress",
        COMPLETED : "status-complete"
    }

  return (
    <div className="custom-card">
      <div className="content">
        <div className="plan">
          <div className="inner">
            <span className={clsx("status", statusClass[task.status])}>
              <span>
              <small>{task.status}</small>
              </span>
            </span>
            <p className="title">{task.name}</p>
            <p className="info">
              {task.description}
            </p>
            <ul className="features">
              <li>
                <span className="icon">
                  <svg
                    height="24"
                    width="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path
                      fill="currentColor"
                      d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"
                    ></path>
                  </svg>
                </span>
                <span>
                  <strong>20</strong> team members
                </span>
              </li>
              <li>
                <span className="icon">
                  <svg
                    height="24"
                    width="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path
                      fill="currentColor"
                      d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"
                    ></path>
                  </svg>
                </span>
                <span>
                  Plan <strong>team meetings</strong>
                </span>
              </li>
              <li>
                <span className="icon">
                  <svg
                    height="24"
                    width="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path
                      fill="currentColor"
                      d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"
                    ></path>
                  </svg>
                </span>
                <span>File sharing</span>
              </li>
            </ul>
            <div className="action">
              <a className="button" href="#">
              <span style={{marginRight:NORMAL_DISTANCE}}>Edit</span><NewTask mode='update' projectIdProp={task.project_id} taskDataProp={task} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TiltedCard;
