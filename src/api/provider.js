import Task from "../models/task";
import {nanoid} from "nanoid";

const isOnLine = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getTasks() {
    if (isOnLine()) {
      return this._api.getTasks()
        .then((tasks) => {
          tasks.forEach((task) => {
            this._store.setItem(task.id, task.toRAW());
          });

          return tasks;
        });
    }

    const storeTasks = Object.values(this._store.getItems());
    return Promise.resolve(Task.parseTasks(storeTasks));
  }

  updateTasks(id, task) {
    if (isOnLine()) {
      return this._api.updateTasks(id, task)
        .then((newTask) => {
          this._store.setItem(newTask.id, newTask.toRAW());

          return newTask;
        });
    }
    const localTask = Task.clone(Object.assign(task, {id}));
    this._store.setItem(id, localTask.toRAW());
    return Promise.resolve(localTask);
  }

  createTask(task) {
    if (isOnLine()) {
      return this._api.createTask(task)
        .then((newTask) => {
          this._store.setItem(newTask.id, newTask.toRAW());

          return newTask;
        });
    }

    const localNewTaskId = nanoid();
    const localTask = Task.clone(Object.assign(task, {id: localNewTaskId}));
    this._store.setItem(localTask.id, localTask.toRAW());

    return Promise.resolve(localTask);
  }

  deleteTask(id) {
    if (isOnLine()) {
      return this._api.deleteTask(id)
        .then(() => this._store.removeItem(id));
    }
    this._store.removeItem(id);
    return Promise.resolve();
  }

}
