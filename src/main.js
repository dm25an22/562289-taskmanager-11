import API from "./api";
import BoardComponent from "./components/board";
import MenuComponent, {MenuItem} from "./components/menu";
import TasksModel from "./models/tasks.js";
import FilterController from "./controllers/filter.js";
import {render, RenderPosition} from "./utils/render";
import BoardController from "./controllers/board";

const AUTHORIZATION = `Basic aldas#ponnsad`;

const api = new API(AUTHORIZATION);
const tasksModel = new TasksModel();

const main = document.querySelector(`.main`);
const mainControl = main.querySelector(`.main__control`);

const menuComponent = new MenuComponent();
const filterController = new FilterController(main, tasksModel);
const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent, tasksModel, filterController);

render(mainControl, menuComponent, RenderPosition.BEFOREEND);
filterController.render();
render(main, boardComponent, RenderPosition.BEFOREEND);

menuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      menuComponent.setActiveItem(MenuItem.TASKS);
      boardController.createTask();
      break;
  }
});

api.getTasks()
  .then((tasks) => {
    tasksModel.setTasks(tasks);
    boardController.render();
  });
