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
  
  export const register = async (user) => {
    return fetcher({
      url: "/api/register",
      method: "POST",
      body: user,
      json: false,
    });
  };

  export const signin = async (user) => {
    return fetcher({
      url: "/api/signin",
      method: "POST",
      body: user,
      json: false,
    });
  };

  export const createNewProject = async (name:string) => {
    return fetcher({
      url: "/api/project",
      method: "POST",
      body: { name },
    });
  };

  export const createNewTask = async (projectId: string, name: string, description: string, due: Date) => {
    return fetcher({
      url: "/api/task",
      method: "POST",
      body: {projectId, name, description, due },
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
  
  