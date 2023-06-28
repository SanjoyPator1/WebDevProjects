import { C8, Tasklist } from "camunda-8-sdk";

import chalk from "chalk";
import * as path from "path";
import { config } from "dotenv";
config();

const zbc = new C8.ZBClient();
const operate = new C8.OperateApiClient();
const optimize = new C8.OptimizeApiClient(); // unused
const tasklist = new C8.TasklistApiClient();
import { join } from "path";

const getLogger = (prefix: string, color: chalk.Chalk) => (msg: string) =>
  console.log(color(`[${prefix}] ${msg}`));

async function main() {
  const log = getLogger("Zeebe", chalk.greenBright);

  // deploy a process with  a bpmn
  // try{
  //   const res = await zbc.deployProcess(
  //     path.join(process.cwd(), 'bpmn', 'c8-sdk-third.bpmn')
  //   );
  //   log(`Deployed process ${JSON.stringify(res, null, 2)}`);

  // }catch(err){
  //   log(`Deploy failed: ${err}`);
  // }

  // ----------------------------------------------------------------------------------------

  // start a new process
  try {
    const p = await zbc.createProcessInstance({
      bpmnProcessId: "c8-sdk-third",
      variables: {
        patientId: "p-100",
        humanTaskStatus: "not done",
      },
    });

    log(`Process creation p = ${JSON.stringify(p, null, 2)}`);

    //get XML file
    // const bpmn = await operate.getProcessDefinitionXML(
    //   parseInt(p.processDefinitionKey, 10)
    // );
    // log(chalk.redBright("\n[Operate] BPMN XML:", bpmn));
  } catch (err) {
    log(`Process creation failed :  ${JSON.stringify(err, null, 2)}`);
  }

  // ---------------------------------------------------------------------------------------

  //claim human task
  console.log(`Starting human task poller...`);

  //long polling with interval 5000 to get task list
  setInterval(async () => {
    const log = getLogger("Tasklist", chalk.yellowBright);

    let taskListRes;
    let taskClaimed;

    //get task list
    try {
      taskListRes = await tasklist.getTasks({
        state: Tasklist.TaskState.CREATED,
      });

      log(`tasklist full ${JSON.stringify(taskListRes, null, 2)}`);
    } catch (err) {
      log(`getTasks error ${JSON.stringify(err, null, 2)}`);
    }

    //do this if tasks were present
    if (taskListRes && taskListRes.tasks.length > 0) {
      log(`fetched ${taskListRes.tasks.length} human tasks`);

      //looping tasklist
      taskListRes.tasks.forEach(async (task) => {
        log(`tasklist each ${JSON.stringify(task, null, 2)}`);

        log(`claiming task ${task.id} from process ${task.processInstanceId}`);

        //claiming task
        try {
          let { claimTask } = await tasklist.claimTask(
            task.id,
            "demo-bot human-task-completer",
            true
          );

          taskClaimed = claimTask;
          taskClaimed &&
            log(
              `servicing human task ${JSON.stringify(taskClaimed, null, 2)}`
            );
        } catch (err) {
          log(`claimTask error ${JSON.stringify(err, null, 2)}`);
          console.log(err);
        }

        //completing task
        try {
          // console.log(`completing task for ${JSON.stringify(taskClaimed, null, 2)}`);
          (await taskClaimed) &&
            tasklist.completeTask(taskClaimed.id, {
              humanTaskStatus: "Got done",
            });
        } catch (error) {
          log(
            `error while checking task list complete ${JSON.stringify(
              error,
              null,
              2
            )}`
          );
        }
      });
    } else {
      log("No human tasks found");
    }
  }, 3000);
}

main();
