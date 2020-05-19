import API from "./api";
import BoardComponent from "./components/board";
import MenuComponent, {MenuItem} from "./components/menu";
import TasksModel from "./models/tasks.js";
import FilterController from "./controllers/filter.js";
import {render, RenderPosition, remove} from "./utils/render";
import BoardController from "./controllers/board";
import NoTaskComponent from "./components/no-task";

const AUTHORIZATION = `Basic aldas#ponnsad`;

const api = new API(AUTHORIZATION);
const tasksModel = new TasksModel();

const main = document.querySelector(`.main`);
const mainControl = main.querySelector(`.main__control`);

const menuComponent = new MenuComponent();
const filterController = new FilterController(main, tasksModel);
const boardComponent = new BoardComponent();
const noTaskComponent = new NoTaskComponent(true);
const boardController = new BoardController(boardComponent, tasksModel, filterController, api);

render(mainControl, menuComponent, RenderPosition.BEFOREEND);
filterController.render();
render(main, boardComponent, RenderPosition.BEFOREEND);
render(boardComponent.getElement(), noTaskComponent, RenderPosition.BEFOREEND);

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
    remove(noTaskComponent);
    tasksModel.setTasks(tasks);
    boardController.render();
  })
  .catch(() => {
    const noTask = noTaskComponent.getElement().querySelector(`.board__no-tasks`);
    noTask.innerHTML = ``;
    noTask.innerHTML = `Click «ADD NEW TASK» in menu to create your first task`;
  });
