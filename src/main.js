
import {createMenuTemplate} from "./components/menu";
import {createMainFiltersTemplate} from "./components/filters";
import {createBoardTemplate} from "./components/board";
import {createAddTaskTemplate} from "./components/addTask";
import {createTaskCardTemplate} from "./components/taskCard";
import {createLoadButton} from "./components/loadButton";
import {filterMock} from "./mock/filter";
import {taskData} from "./mock/task";

let SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderElement = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const main = document.querySelector(`.main`);
const mainControl = main.querySelector(`.main__control`);

renderElement(mainControl, createMenuTemplate());
renderElement(main, createMainFiltersTemplate(filterMock));
renderElement(main, createBoardTemplate());

const board = main.querySelector(`.board`);
const boardTasks = board.querySelector(`.board__tasks`);

renderElement(boardTasks, createAddTaskTemplate(taskData[0]));

let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;


taskData.slice(1, showingTasksCount)
  .forEach((it) => renderElement(boardTasks, createTaskCardTemplate(it)));

renderElement(board, createLoadButton());

const loadMoreButton = main.querySelector(`.load-more`);

loadMoreButton.addEventListener(`click`, () => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

  taskData.slice(prevTasksCount, showingTasksCount)
    .forEach((it) => renderElement(boardTasks, createTaskCardTemplate(it)));

  if (showingTasksCount >= taskData.length) {
    loadMoreButton.remove();
  }
});
