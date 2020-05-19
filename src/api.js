import Task from "./models/task";

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(authorization) {
    this.authorization = authorization;
  }

  getTasks() {
    const headers = new Headers();
    headers.append(`Authorization`, this.authorization);

    return fetch(`https://11.ecmascript.pages.academy/task-manager/tasks`, {headers})
    .then(checkStatus)
    .then((response) => response.json())
    .then(Task.parseTasks);
  }

  updateTasks(id, data) {
    const headers = new Headers();
    headers.append(`Authorization`, this.authorization);
    headers.append(`Content-Type`, `application/json`);

    return fetch(`https://11.ecmascript.pages.academy/task-manager/tasks/${id}`, {
      method: `PUT`,
      body: JSON.stringify(data.toRAW()),
      headers,
    })
      .then(checkStatus)
      .then((response) => response.json())
      .then(Task.parseTask);
  }

}
