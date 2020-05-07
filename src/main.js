import BoardComponent from "./components/board";
import MenuComponent, {MenuItem} from "./components/menu";
import TasksModel from "./models/tasks.js";
import {taskData} from "./mock/task";
import FilterController from "./controllers/filter.js";
import {render, RenderPosition} from "./utils/render";
import BoardController from "./controllers/board";

const tasksModel = new TasksModel();
tasksModel.setTasks(taskData);

const main = document.querySelector(`.main`);
const mainControl = main.querySelector(`.main__control`);

const menuComponent = new MenuComponent();
render(mainControl, menuComponent, RenderPosition.BEFOREEND);

const filterController = new FilterController(main, tasksModel);
filterController.render();

const boardComponent = new BoardComponent();
render(main, boardComponent, RenderPosition.BEFOREEND);

const boardController = new BoardController(boardComponent, tasksModel, filterController);
boardController.render();

menuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      menuComponent.setActiveItem(MenuItem.TASKS);
      boardController.createTask();
      break;
  }
});

