import BoardComponent from "./components/board";
import FilterComponent from "./components/filters";
import MenuComponent from "./components/menu";

import {taskData} from "./mock/task";
import {filterMock} from "./mock/filter";
import {render, RenderPosition} from "./utils/render";
import BoardController from "./controllers/board";

const main = document.querySelector(`.main`);
const mainControl = main.querySelector(`.main__control`);

render(mainControl, new MenuComponent(), RenderPosition.BEFOREEND);
render(main, new FilterComponent(filterMock), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent);

render(main, boardComponent, RenderPosition.BEFOREEND);
boardController.render(taskData);
