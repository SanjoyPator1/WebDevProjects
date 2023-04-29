export interface ProjectModel {
    id: string;
    created_at: Date;
    updated_at: Date | null;
    owner_id: string;
    project_name: string;
    description: string;
    due: Date;
    deleted: boolean;
  }

export interface TaskModel {
    id: string;
    created_at: Date;
    updated_at: Date | null;
    owner_id: string;
    project_id: string;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    name: string;
    description: string;
    due: Date;
    deleted: boolean;
  }
  
  export interface ProjectWithTaskModel {
    id: string;
    created_at: Date;
    updated_at: Date | null;
    owner_id: string;
    project_name: string;
    description: string;
    due: Date;
    deleted: boolean;
    tasks: TaskModel[];
  }




  