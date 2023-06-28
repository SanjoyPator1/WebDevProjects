export interface createProcessObjModel {
  bpmnProcessId: string;
  variables: { [key: string]: any };
  version?: number;
}
