const fetcher = async ({ url, method, body, json = true }) => {
  const res = await fetch(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });


  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data;
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
  return fetcher({
    url: "/api/signin",
    method: "POST",
    body: user,
    json: false,
  });
};

export const updateUser = async (
  firstName: string,
  lastName: string,
  email: string
) => {
  return fetcher({
    url: "/api/user",
    method: "PUT",
    body: { firstName, lastName, email },
  });
};

//PROJECT API
export const createNewProject = async (
  name: string,
  description: string,
  due: Date
) => {
  return fetcher({
    url: "/api/project",
    method: "POST",
    body: { name, description, due },
  });
};

export const updateProject = async (
  projectId: string,
  name: string,
  description: string,
  due: string
) => {
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
export const getTask = async (
  startDate?: Date,
  endDate?: Date,
) => {
  
  const isoStartDate = startDate?.toISOString();
  const isoEndDate = endDate?.toISOString();

  return fetcher({
    url: `/api/task?startDate=${isoStartDate}&endDate=${isoEndDate}`,
    method: "GET",
  });
};

export const createNewTask = async (
  projectId: string,
  status: string,
  name: string,
  description: string,
  due: Date
) => {
  return fetcher({
    url: "/api/task",
    method: "POST",
    body: { projectId, status, name, description, due },
  });
};

export const updateTask = async (
  taskId: string,
  name: string,
  description: string,
  status: string,
  due: string
) => {
  return fetcher({
    url: "/api/task",
    method: "PUT",
    body: { taskId, name, description, status, due },
  });
};

export const deleteTask = async (taskId: string) => {
  return fetcher({
    url: `/api/task?taskId=${taskId}`,
    method: "DELETE",
    body: { taskId },
  });
};
