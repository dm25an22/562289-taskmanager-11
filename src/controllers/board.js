import {render, RenderPosition, replace, remove} from "../utils/render";
import SortComponent from "../components/sort";
import NoTaskComponent from "../components/no-task";
import LoadMoreButtonComponent from "../components/load-button";
import TaskEditComponent from "../components/edit-task";
import TasksCardComponent from "../components/task-card";
import TasksComponent from "../components/tasks.js";

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTask = (taskListElement, task) => {
  const tasksCardComponent = new TasksCardComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

  const replaceTaskToEdit = () => {
    replace(taskEditComponent, tasksCardComponent);
  };

  const replaceEditToTask = () => {
    replace(tasksCardComponent, taskEditComponent);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  tasksCardComponent.setEditButtonClickHandler(() => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, tasksCardComponent, RenderPosition.BEFOREEND);
};

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._noTaskComponent = new NoTaskComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  render(tasks) {
    const isAllTasksArchived = tasks.every((it) => it.isArchive);
    const boardComponent = this._container.getElement();

    if (isAllTasksArchived) {
      render(boardComponent, this._noTaskComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(boardComponent, this._sortComponent, RenderPosition.BEFOREEND);
    render(boardComponent, this._tasksComponent, RenderPosition.BEFOREEND);

    const taskListElement = boardComponent.querySelector(`.board__tasks`);
    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    tasks.slice(0, showingTasksCount)
    .forEach((task) => {
      renderTask(taskListElement, task);
    });

    const loadMoreButtonComponent = this._loadMoreButtonComponent;
    render(boardComponent, loadMoreButtonComponent, RenderPosition.BEFOREEND);

    loadMoreButtonComponent.setClickHandler(() => {
      const prevShowElement = showingTasksCount;
      showingTasksCount = prevShowElement + SHOWING_TASKS_COUNT_BY_BUTTON;

      tasks.slice(prevShowElement, showingTasksCount)
      .forEach((it) => {
        renderTask(taskListElement, it);
      });

      if (showingTasksCount >= tasks.length) {
        remove(loadMoreButtonComponent);
      }
    });

  }

}