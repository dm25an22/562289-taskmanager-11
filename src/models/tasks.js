import {getTasksByFilter} from "../utils/filter.js";
import {FilterType} from "../const.js";

export default class Tasks {
  constructor() {
    this._tasks = [];
    this._dataChangeHandlers = [];
    this._filterChangeHandlers = []; // Содержит функцию перирисовки

    this._activeFilterType = FilterType.ALL;
  }

  getTasks() {
    return getTasksByFilter(this._tasks, this._activeFilterType);
  }

  getTasksAll() {
    return this._tasks;
  }

  setTasks(tasks) {
    this._tasks = tasks;
    this._callHandlers(this._dataChangeHandlers);

  }

  updateTask(oldId, newTask) {
    const index = this._tasks.findIndex((it) => it.id === oldId);

    if (index === -1) {
      return false;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), newTask, this._tasks.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  removeTask(id) {
    const index = this._tasks.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), this._tasks.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers); // вызывает колбэк

    return true;
  }

  addTask(newTask) {
    this._tasks = [].concat(newTask, this._tasks);
    this._callHandlers(this._dataChangeHandlers);

  }

  setFilter(filterName) {
    this._activeFilterType = filterName;
    this._callHandlers(this._filterChangeHandlers); // вызываем функци. из this._filterChangeHandlers
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler); // Принимает колбэк
  }

  setDataChangeHandlers(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((it) => it()); // Вызывает фунукции
  }

}
