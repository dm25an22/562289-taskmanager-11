import BoardComponent from "./components/board";
import FilterComponent from "./components/filters";
import LoadMoreButtonComponent from "./components/load-button";
import TaskEditComponent from "./components/edit-task";
import TasksCardComponent from "./components/task-card";
import TasksComponent from "./components/tasks.js";
import MenuComponent from "./components/menu";
import SortComponent from "./components/sort";

import {filterMock} from "./mock/filter";
import {taskData} from "./mock/task";
import {render} from "./utils";
import {RenderPosition} from "./const";

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTask = (taskListElement, task) => {
  const tasksCardComponent = new TasksCardComponent(task);
  const editBitton = tasksCardComponent.getElement().querySelector(`.card__btn--edit`);

  const taskEditComponent = new TaskEditComponent(task);
  const editForm = taskEditComponent.getElement().querySelector(`form`);

  const onEdditCardButtonClick = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), tasksCardComponent.getElement());
  };

  const onEdditCardSubmit = (evt) => {
    evt.preventDefault();
    taskListElement.replaceChild(tasksCardComponent.getElement(), taskEditComponent.getElement());
  };

  editBitton.addEventListener((`click`), onEdditCardButtonClick);
  editForm.addEventListener((`submit`), onEdditCardSubmit);

  render(taskListElement, tasksCardComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderBoard = (boardComponent, tasks) => {
  render(boardComponent.getElement(), new SortComponent().getElement(), RenderPosition.BEFOREEND);
  render(boardComponent.getElement(), new TasksComponent().getElement(), RenderPosition.BEFOREEND);

  const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);
  let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

  tasks.slice(0, showingTasksCount)
    .forEach((task) => {
      renderTask(taskListElement, task);
    });

  const loadMoreButtonComponent = new LoadMoreButtonComponent();
  render(boardComponent.getElement(), loadMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

  loadMoreButtonComponent.getElement().addEventListener((`click`), () => {
    const prevShowElement = showingTasksCount;
    showingTasksCount = prevShowElement + SHOWING_TASKS_COUNT_BY_BUTTON;

    tasks.slice(prevShowElement, showingTasksCount)
      .forEach((it) => {
        renderTask(taskListElement, it);
      });

    if (showingTasksCount >= tasks.length) {
      loadMoreButtonComponent.getElement().remove();
      loadMoreButtonComponent.removeElement();
    }
  });

};


const main = document.querySelector(`.main`);
const mainControl = main.querySelector(`.main__control`);


render(mainControl, new MenuComponent().getElement(), RenderPosition.BEFOREEND);
render(main, new FilterComponent(filterMock).getElement(), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
render(main, boardComponent.getElement(), RenderPosition.BEFOREEND);
renderBoard(boardComponent, taskData);

