import { C8, Tasklist } from "camunda-8-sdk";

import chalk from "chalk";
import * as path from "path";
import { config } from "dotenv";
config();

const zbc = new C8.ZBClient();
const operate = new C8.OperateApiClient();
const optimize = new C8.OptimizeApiClient(); // unused
const tasklist = new C8.TasklistApiClient();

const getLogger = (prefix: string, color: chalk.Chalk) => (msg: string) =>
  console.log(color(`[${prefix}] ${msg}`));

async function main() {
  const log = getLogger("Zeebe", chalk.greenBright);
  const res = await zbc.deployProcess(
    path.join(process.cwd(), "resources", "c8-sdk-demo.bpmn")
  );
  log(`Deployed process ${res.key}`);

  const p = await zbc.createProcessInstanceWithResult(`c8-sdk-demo`, {
    humanTaskStatus: "Needs doing",
  });
  log(`Finished Process Instance ${p.processInstanceKey}`);
  log(`humanTaskStatus is "${p.variables.humanTaskStatus}"`);

  const bpmn = await operate.getProcessDefinitionXML(
    parseInt(p.processDefinitionKey, 10)
  );
  log(chalk.redBright("\n[Operate] BPMN XML:", bpmn));
}

console.log(`Creating worker...`);
zbc.createWorker({
  taskType: "service-task",
  taskHandler: (job) => {
    const log = getLogger("Zeebe Worker", chalk.blueBright);
    log(`handling job ${job.bpmnProcessId}`);
    return job.complete();
  },
});

console.log(`Starting human task poller...`);
setInterval(async () => {
  const log = getLogger("Tasklist", chalk.yellowBright);
  const res = await tasklist.getTasks({
    state: Tasklist.TaskState.CREATED,
  });
  if (res.tasks.length > 0) {
    log(`fetched ${res.tasks.length} human tasks`);
    res.tasks.forEach(async (task) => {
      log(`claiming task ${task.id} from process ${task.processInstanceId}`);
      let t;
      try {
        let { claimTask } = await tasklist.claimTask(task.id, "demobot", true);
        t = claimTask;
      } catch (err) {
        log(`claimTask error ${err}`)
      }
      t && log(`servicing human task ${t.id} from process ${t.processInstanceId}`);
      try {
        await t && tasklist.completeTask(t.id, {
          humanTaskStatus: "Got done",
        });
      } catch (error) {
        log(`error while checking task list complete ${error}`);
      }
    });
  } else {
    log("No human tasks found");
  }
}, 3000);

main();