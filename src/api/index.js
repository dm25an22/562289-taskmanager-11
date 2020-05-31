import Task from "../models/task";

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`
};

export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this.authorization = authorization;
  }

  _load({url, method, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this.authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }

  getTasks() {
    return this._load({url: `tasks`})
    .then((response) => response.json())
    .then(Task.parseTasks);
  }

  createTask(newTask) {
    return this._load({
      url: `tasks`,
      method: Method.POST,
      body: JSON.stringify(newTask.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
    .then((response) => response.json())
    .then(Task.parseTask);
  }

  deleteTask(id) {
    return this._load({url: `tasks/${id}`, method: Method.DELETE});
  }

  updateTasks(id, data) {
    return this._load({
      url: `/tasks/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Task.parseTask);
  }

}
