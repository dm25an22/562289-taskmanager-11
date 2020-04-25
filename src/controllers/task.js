import TaskEditComponent from "../components/edit-task";
import TasksCardComponent from "../components/task-card";
import {render, RenderPosition, replace, remove} from "../utils/render";


export default class TaskController {
  constructor(container) {
    this._container = container;

    this._tasksCardComponent = null;
    this._taskEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(task) {
    this._tasksCardComponent = new TasksCardComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);

    this._tasksCardComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToTask();
    });

    render(this._container, this._tasksCardComponent, RenderPosition.BEFOREEND);
  }

  _replaceTaskToEdit() {
    replace(this._taskEditComponent, this._tasksCardComponent);
  }

  _replaceEditToTask() {
    replace(this._tasksCardComponent, this._taskEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

}

