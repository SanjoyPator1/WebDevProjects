import { C8, Tasklist } from "camunda-8-sdk";
import { createProcessObjModel } from "../../models/bpmnModel";
import chalk from "chalk";
import * as path from "path";
const zbc = new C8.ZBClient();
const operate = new C8.OperateApiClient();
const optimize = new C8.OptimizeApiClient(); // unused
const tasklist = new C8.TasklistApiClient();
import { join } from "path";

const getLogger = (prefix: string, color: chalk.Chalk) => (msg: string) =>
  console.log(color(`[${prefix}] ${msg}`));
const log = getLogger("Process handler : ", chalk.greenBright);

// deploy a process model with  a bpmn -  (POST) - {bpmnFileName}
export const deployProcess = async (req, res, next) => {
  const bpmnFileName = req.body.bpmnFileName;
  log(`Deploying process with bpmn : ${bpmnFileName}`);

  try {
    const deployedProcessRes = await zbc.deployProcess(
      path.join(process.cwd(), "bpmn", bpmnFileName)
    );
    log(
      `Deployed process successfully ${JSON.stringify(
        deployedProcessRes,
        null,
        2
      )}`
    );
    //same as res.json({token : token})
    res.json({ deployedProcessRes });
  } catch (error: any) {
    error.type = "process-error";
    log(`Deploy failed : ${error}`);
    next(error);
  }
};

// Create a new process instance - (POST) - {bpmnProcessId, optional:  initialVariables }
export const createProcess = async (req, res, next) => {
  const bpmnProcessId = req.body.bpmnProcessId;
  const initialVariables = req.body.initialVariables;

  const createProcessObj: createProcessObjModel = {
    bpmnProcessId,
    variables: initialVariables,
  };

  // if versionId is present in req.body
  // add it to createProcessObj
  if ("versionId" in req.body) {
    createProcessObj.version = req.body.versionId;
  }

  log(`creating process with ${createProcessObj}`)

  try {
    const createProcessRes = await zbc.createProcessInstance(createProcessObj);

    log(`Create Process Res = ${JSON.stringify(createProcessRes, null, 2)}`);
    //same as res.json({token : token})
    res.json({ createProcessRes });
  } catch (error: any) {
    error.type = "process-error";
    log(`Create Process failed :  ${JSON.stringify(error, null, 2)}`);
    next(error);
  }
};

// get the XML diagram of the process - (POST) -  { processDefinitionKey }
export const getProcessDefinitionXML = async (req, res, next) => {
  const processDefinitionKey = req.params.processDefinitionKey;

  log(`Getting Process Definition XML with ${processDefinitionKey}`)

  try {
    const processDefinitionXMLRes = await operate.getProcessDefinitionXML(
      parseInt(processDefinitionKey, 10)
    );
    log(chalk.redBright("\n[Operate] BPMN XML:", processDefinitionXMLRes));
    //same as res.json({token : token})
    res.json({ processDefinitionXMLRes });
  } catch (error: any) {
    error.type = "process-error";
    log(`Get Process Definition XML failed :  ${JSON.stringify(error, null, 2)}`);
    next(error);
  }
};
