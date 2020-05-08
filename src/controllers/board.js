import {render, RenderPosition, remove} from "../utils/render";
import SortComponent, {SortType} from "../components/sort";
import NoTaskComponent from "../components/no-task";
import LoadMoreButtonComponent from "../components/load-button";
import TaskController, {Mode as TaskControllerMode, EmptyTask} from "../controllers/task";
import TasksComponent from "../components/tasks.js";
import {getSortedTasks} from "../utils/common";
import {FilterType} from "../const";

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTasks = (taskListElement, tasks, onDataChange, onViewChange, onFilterChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange, onFilterChange);
    taskController.render(task, TaskControllerMode.DEFAULT);

    return taskController;
  });
};

export default class BoardController {
  constructor(container, tasksModel, filterController) {
    this._container = container;

    this._tasksModel = tasksModel;
    this._showedTaskControllers = [];
    this._creatingTask = null;

    this._noTaskComponent = new NoTaskComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
    this._filterController = filterController;

    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange.bind(this));

    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);
    this._tasksModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const tasks = this._tasksModel.getTasks();

    const boardComponent = this._container.getElement();

    if (this._checkTasksArchived(tasks)) {
      this._createNoTasksComponent();
      return;
    }

    render(boardComponent, this._sortComponent, RenderPosition.BEFOREEND);
    render(boardComponent, this._tasksComponent, RenderPosition.BEFOREEND);


    this._renderTasks(tasks.slice(0, this._showingTasksCount));
    this._renderLoadMoreButton();
  }

  _renderTasks(tasks) {
    const taskListElement = this._tasksComponent.getElement();
    const newTasks = renderTasks(taskListElement, tasks, this._onDataChange, this._onViewChange, this._onFilterChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
    this._showingTasksCount = this._showedTaskControllers.length;
  }

  _removeTasks() {
    this._showedTaskControllers.forEach((taskController) => taskController.destroy());
    this._showedTaskControllers = [];
  }

  _updateTasks() {
    this._removeTasks();
    this._renderTasks(this._tasksModel.getTasks().slice(0, SHOWING_TASKS_COUNT_ON_START));
    this._renderLoadMoreButton();
  }

  _onDataChange(taskController, oldData, newData) {
    if (oldData === EmptyTask) {
      this._creatingTask = null;
      if (newData === null) {
        taskController.destroy();
        this._updateTasks(this._showingTasksCount);
      } else {
        this._tasksModel.addTask(newData);
        taskController.render(newData, TaskControllerMode.DEFAULT);
        if (this._showingTasksCount % SHOWING_TASKS_COUNT_BY_BUTTON === 0) {
          const destroyedTask = this._showedTaskControllers.pop();
          destroyedTask.destroy();
        }
        this._showedTaskControllers = [].concat(taskController, this._showedTaskControllers);
        this._showingTasksCount = this._showedTaskControllers.length;
        this._renderLoadMoreButton();
      }
    } else if (newData === null) {
      this._tasksModel.removeTask(oldData.id);
      this._updateTasks(this._showingTasksCount);
    } else {
      const isSuccess = this._tasksModel.updateTask(oldData.id, newData);
      if (isSuccess) {
        taskController.render(newData, TaskControllerMode.DEFAULT);
      }
    }

    if (this._checkTasksArchived(this._tasksModel.getTasksAll())) {
      this._createNoTasksComponent();
      return;
    }

  }

  _checkTasksArchived(tasks) {
    const isAllTasksArchived = tasks.every((it) => it.isArchive);
    return isAllTasksArchived;
  }

  _createNoTasksComponent() {
    remove(this._sortComponent);
    remove(this._tasksComponent);
    render(this._container.getElement(), this._noTaskComponent, RenderPosition.BEFOREEND);
  }

  _removeNoTasksComponent() {
    if (this._noTaskComponent) {
      remove(this._noTaskComponent);
      const boardComponent = this._container.getElement();

      render(boardComponent, this._sortComponent, RenderPosition.BEFOREEND);
      render(boardComponent, this._tasksComponent, RenderPosition.BEFOREEND);
    }
  }

  createTask() {
    if (this._creatingTask) {
      return;
    }

    this._removeNoTasksComponent();

    this._onSortTypeChange(SortType.DEFAULT);
    this._sortComponent.resetSortType();
    this._filterController.resetFilter();
    this._onFilterChange();
    this._onViewChange();
    this._creatingTask = new TaskController(this._tasksComponent.getElement(), this._onDataChange, this._onViewChange, this._onFilterChange);
    this._creatingTask.render(EmptyTask, TaskControllerMode.ADDING);
    this._showedTaskControllers = [].concat(this._creatingTask, this._showedTaskControllers);
  }

  _removeEditTask() {
    if (this._creatingTask) {
      this._creatingTask.destroy();
      this._creatingTask = null;
    }
  }

  _onViewChange() {
    this._removeEditTask();
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }


  _renderLoadMoreButton() {
    remove(this._loadMoreButtonComponent);

    if (this._showingTasksCount >= this._tasksModel.getTasks().length) {
      return;
    }

    const boardComponent = this._container.getElement();

    render(boardComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this._loadMoreButtonComponent.setClickHandler(this._onLoadMoreButtonClick);
  }

  _onLoadMoreButtonClick() {
    const prevShowElement = this._showingTasksCount;
    this._showingTasksCount = prevShowElement + SHOWING_TASKS_COUNT_BY_BUTTON;

    const sortedTasks = getSortedTasks(this._tasksModel.getTasks(), this._sortComponent.getSortType(), prevShowElement, this._showingTasksCount);

    this._renderTasks(sortedTasks);


    if (this._showingTasksCount >= this._tasksModel.getTasks().length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _onSortTypeChange(sortType) {
    this._removeEditTask();

    this._showingTasksCount = SHOWING_TASKS_COUNT_BY_BUTTON;
    this._removeTasks();

    const sortedTasks = getSortedTasks(this._tasksModel.getTasks(), sortType, 0, this._showingTasksCount);
    this._renderTasks(sortedTasks);

    this._renderLoadMoreButton();
  }

  _onFilterChange() {
    this._removeEditTask();
    if (this._filterController.getFilterType() === FilterType.ARCHIVE) {
      this._removeNoTasksComponent();
    }
    
    this._sortComponent.resetSortType();
    this._updateTasks();
  }

}
