const QUANTITY_CARDS = 3;

import {createMenuTemplate} from "./components/menu";
import {createMainFiltersTemplate} from "./components/filters";
import {createBoardTemplate} from "./components/board";
import {createAddTaskTemplate} from "./components/addTask";
import {createTaskCardTemplate} from "./components/taskCard";
import {createLoadButton} from "./components/loadButton";

const renderElement = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const main = document.querySelector(`.main`);
const mainControl = main.querySelector(`.main__control`);

renderElement(mainControl, createMenuTemplate());
renderElement(main, createMainFiltersTemplate());
renderElement(main, createBoardTemplate());

const board = main.querySelector(`.board`);
const boardTasks = board.querySelector(`.board__tasks`);

renderElement(boardTasks, createAddTaskTemplate());

for (let i = 0; i < QUANTITY_CARDS; i++) {
  renderElement(boardTasks, createTaskCardTemplate());
}

renderElement(board, createLoadButton());
