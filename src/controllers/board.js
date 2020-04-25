import {render, RenderPosition, replace, remove} from "../utils/render";
import SortComponent from "../components/sort";
import NoTaskComponent from "../components/no-task";
import LoadMoreButtonComponent from "../components/load-button";
import TaskController from "../controllers/task";
import TasksComponent from "../components/tasks.js";
import {getSortedTasks} from "../utils/common";

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTasks = (taskListElement, tasks) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement);
    taskController.render(task);

    return taskController;
  });
};

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._tasks = [];

    this._noTaskComponent = new NoTaskComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();

    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange.bind(this));
  }

  render(tasks) {

    this._tasks = tasks;

    const isAllTasksArchived = tasks.every((it) => it.isArchive);
    const boardComponent = this._container.getElement();

    if (isAllTasksArchived) {
      render(boardComponent, this._noTaskComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(boardComponent, this._sortComponent, RenderPosition.BEFOREEND);
    render(boardComponent, this._tasksComponent, RenderPosition.BEFOREEND);

    const taskListElement = this._tasksComponent.getElement();
    const newTask = renderTasks(taskListElement, tasks.slice(0, this._showingTasksCount));
    console.log(newTask);

    this._renderLoadMoreButton();
  }

  _renderLoadMoreButton() {
    remove(this._loadMoreButtonComponent);

    if (this._showingTasksCount >= this._tasks.length) {
      return;
    }

    const loadMoreButtonComponent = this._loadMoreButtonComponent;
    const boardComponent = this._container.getElement();
    const taskListElement = this._tasksComponent.getElement();

    render(boardComponent, loadMoreButtonComponent, RenderPosition.BEFOREEND);

    loadMoreButtonComponent.setClickHandler(() => {
      const prevShowElement = this._showingTasksCount;
      this._showingTasksCount = prevShowElement + SHOWING_TASKS_COUNT_BY_BUTTON;

      const sortedTasks = getSortedTasks(this._tasks, this._sortComponent.getSortType(), prevShowElement, this._showingTasksCount);

      renderTasks(taskListElement, sortedTasks);

      if (this._showingTasksCount >= this._tasks.length) {
        remove(loadMoreButtonComponent);
      }
    });
  }

  _onSortTypeChange(sortType) {
    const taskListElement = this._tasksComponent.getElement();
    this._showingTasksCount = SHOWING_TASKS_COUNT_BY_BUTTON;
    taskListElement.innerHTML = ``;

    const sortedTasks = getSortedTasks(this._tasks, sortType, 0, this._showingTasksCount);
    renderTasks(taskListElement, sortedTasks);

    this._renderLoadMoreButton();
  }

}
