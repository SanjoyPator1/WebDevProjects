export interface UserModel {
  id: string;
  created_at: Date;
  updated_at: Date;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}


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




  