import { C8, Tasklist } from "camunda-8-sdk";
import chalk from "chalk";
import * as path from "path";
const zbc = new C8.ZBClient();
const operate = new C8.OperateApiClient();
const optimize = new C8.OptimizeApiClient(); // unused
const tasklist = new C8.TasklistApiClient();
import { join } from "path";

const getLogger = (prefix: string, color: chalk.Chalk) => (msg: string) =>
  console.log(color(`[${prefix}] ${msg}`));
const log = getLogger("service handler : ", chalk.green);

//server health check -  GET /health
export const healthCheck = async (req, res, next) => {
    
    log(`health check hit - GET /health in backend`)
    
    //send acknowledgement of health check
    res.json({
        message : "health check hit - server running properly",
    })
};

// acknowledge covid assessment result -> POST - variables in body 
export const serviceRestApiPost = async (req, res, next) => {
    const resVariablesResult = req.body.resVariables;

    log(`covid assessment result: ${resVariablesResult}`)

    resVariablesResult.message = "got covid assessment result - backend"

    //append acknowledgement of receiving message
    res.json({
        resVariablesResult
    })
};
