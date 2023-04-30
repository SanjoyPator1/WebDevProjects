import { getUserFromCookie } from "@/lib/auth";
import db  from "@/lib/db";
import { cookies } from "next/headers";
import Card from "@/components/Card/Card";
import { TASK_STATUS } from "@/lib/constants";
// import Button from '@mui/material/Button';
import { TaskModel } from "@/model/databaseType";

// const getData = async () => {
//   const user = await getUserFromCookie(cookies());

//   console.log("user: " + user)

//   const query = `
//     SELECT * FROM task
//     WHERE owner_id = $1
//     AND status != $2
//     AND deleted = false
//     ORDER BY due ASC
//     LIMIT 5
//   `;
//   const values = [user?.id, TASK_STATUS.COMPLETED];

//   try {
//     const result = await db({ text: query, params: values });
//     console.log("random tasks: " + result.rows)
//     return result.rows;
//   } catch (error) {
//     console.error('Error retrieving tasks:', error);
//     throw error;
//   }
// };

interface Props{
    title: string;
    tasks: TaskModel[];
}

const TaskCard = async ({ title, tasks }: Props) => {
  console.log("title", title);
  console.log("tasks", tasks);
  const data = tasks;
  console.log("data", data);

  return (
    <Card>
      <div className="flex justify-between items-center">
        <div>
          <span className="text-3xl text-gray-600">{title}</span>
        </div>
        <div>
          create a new task
          {/* <Button variant="contained">
            + Create New
          </Button> */}
        </div>
      </div>
      <div>
        {data && data.length ? (
          <div>
            {data.map((task : TaskModel, index: number) => (
              <div className="py-2" key={index}>
                <div>
                  <span className="text-gray-800">{task.name}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">
                    {task.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>no tasks</div>
        )}
      </div>
    </Card>
  );
};

export default TaskCard;
