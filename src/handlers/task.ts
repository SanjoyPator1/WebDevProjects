import { C8, Tasklist } from "camunda-8-sdk";
import chalk from "chalk";
import * as path from "path";
const zbc = new C8.ZBClient();
const operate = new C8.OperateApiClient();
const optimize = new C8.OptimizeApiClient(); // unused
const tasklist = new C8.TasklistApiClient();

const getLogger = (prefix: string, color: chalk.Chalk) => (msg: string) =>
  console.log(color(`[${prefix}] ${msg}`));
const log = getLogger("Task handler : ", chalk.yellowBright);

//get all task list (GET) - no params,
export const getAllTasks = async (req, res, next) => {
  let taskListRes;

  try {
    taskListRes = await tasklist.getTasks({
      state: Tasklist.TaskState.CREATED,
    });

    log(`Get Tasklist full ${JSON.stringify(taskListRes, null, 2)}`);
    //same as res.json({token : token})
    res.json({ taskListRes });
  } catch (error: any) {
    error.type = "task-error";
    log(`Get Tasklist failed : ${error}`);
    next(error);
  }
};

//get all task list (GET) - no params,
export const getTask = async (req, res, next) => {
  const taskId = req.params.id;

  log(`Getting task with id: ${taskId}`)

  try {
    const taskRes = await tasklist.getTask(
      taskId
    );
    log(`Get Task by Id ${JSON.stringify(taskRes, null, 2)}`);
    //same as res.json({token : token})
    res.json({ taskRes });
  } catch (error: any) {
    error.type = "task-error";
    log(`Get Task by Id failed :  ${JSON.stringify(error, null, 2)}`);
    next(error);
  }
};

// claim a task with task id (POST) - { taskId, assigneeName }
export const claimTask = async (req, res, next) => {
  const taskId = req.body.taskId;
  const assigneeName = req.body.assigneeName;

  log(`Claiming task ${taskId} with assignee ${assigneeName}`);

  try {
    let { claimTask } = await tasklist.claimTask(taskId, assigneeName, true);

    log(`Claimed task successful :  ${JSON.stringify(claimTask, null, 2)}`);
    //same as res.json({token : token})
    res.json({ claimTask });
  } catch (error: any) {
    error.type = "task-error";
    log(`Claim task failed :  ${JSON.stringify(error, null, 2)}`);
    next(error);
  }
};

// complete a task and provide variables (POST) - { taskId, taskVariables : optional }
export const completeTask = async (req, res, next) => {
  const taskId = req.body.taskId;
  const taskVariables = req.body.taskVariables;

  log(`Completing task : ${taskId} with task variables ${taskVariables}`);

  // TODO: check if task is already completed

  try {
    const completeTaskRes = await tasklist.completeTask(taskId, taskVariables);
    log(
      `Complete task successful :  ${JSON.stringify(completeTaskRes, null, 2)}`
    );
    //same as res.json({token : token})
    res.json({ completeTaskRes });
  } catch (error: any) {
    error.type = "task-error";
    log(
      `Complete task failed :  ${JSON.stringify(error, null, 2)}`
    );
    next(error);
  }
};
