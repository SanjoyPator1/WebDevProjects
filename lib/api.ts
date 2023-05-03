const fetcher = async ({ url, method, body, json = true }) => {
    const res = await fetch(url, {
      method,
      body: body && JSON.stringify(body),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  
    if (!res.ok) {
      throw new Error("API Error");
    }
  
    if (json) {
      const data = await res.json();
      return data;
    }
  };
  
  // USER API
  export const register = async (user) => {
    return fetcher({
      url: "/api/register",
      method: "POST",
      body: user,
      json: false,
    });
  };

  export const signin = async (user) => {
    console.log("fe user api ",user)
    return fetcher({
      url: "/api/signin",
      method: "POST",
      body: user,
      json: false,
    });
  };

  export const updateUser = async (firstName: string, lastName: string, email: string ) => {
    console.log("fe user", firstName,lastName, email)
    return fetcher({
      url: "/api/user",
      method: "PUT",
      body: { firstName, lastName, email },
    });
  };


  //PROJECT API
  export const createNewProject = async (name:string, description:string,due: Date ) => {
    return fetcher({
      url: "/api/project",
      method: "POST",
      body: { name, description, due },
    });
  };

  export const updateProject = async (projectId: string, name: string, description: string, due: string) => {
    console.log("fe updateProject", projectId, name, description, due)
    return fetcher({
      url: "/api/project",
      method: "PUT",
      body: { projectId, name, description, due },
    });
  };
  
  export const deleteProject = async (projectId: string) => {
    return fetcher({
      url: `/api/project?projectId=${projectId}`,
      method: "DELETE",
      body: { projectId },
    });
  };
  



  //TASK API
  export const createNewTask = async (projectId: string, status:string, name: string, description: string, due: Date) => {
    return fetcher({
      url: "/api/task",
      method: "POST",
      body: {projectId,status, name, description, due },
    });
  };

  export const updateTask = async (taskId: string, name: string, description: string, status: string, due: string)=> {
    return fetcher({
      url: "/api/task",
      method: "PUT",
      body: { taskId, name, description, status, due },
    });
  };

  export const deleteTask = async (taskId: string) => {
    console.log("deleteTask in fe ", taskId);
    return fetcher({
      url: `/api/task?taskId=${taskId}`,
      method: "DELETE",
      body:{taskId}
    });
  };
  
  