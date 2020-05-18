import Task from "./models/task";

export default class API {
  constructor(authorization) {
    this.authorization = authorization;
  }

  getTasks() {
    const headers = new Headers();
    headers.append(`Authorization`, this.authorization);

    return fetch(`https://11.ecmascript.pages.academy/task-manager/tasks`, {headers})
    .then((response) => response.json())
    .then(Task.parseTasks);
  }

}
