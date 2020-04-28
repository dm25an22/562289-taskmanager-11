import TaskEditComponent from "../components/edit-task";
import TasksCardComponent from "../components/task-card";
import {render, RenderPosition, replace} from "../utils/render";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class TaskController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._tasksCardComponent = null;
    this._taskEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._mode = Mode.DEFAULT;
  }

  render(task) {
    const oldTaskComponent = this._tasksCardComponent;
    const oldTaskEditComponent = this._taskEditComponent;

    this._tasksCardComponent = new TasksCardComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);

    this._tasksCardComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
    });

    this._taskEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToTask();
    });

    this._tasksCardComponent._setArchiveButtonClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isArchive: !task.isArchive
      }));
    });

    this._tasksCardComponent._setFavoritesButtonClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isFavorite: !task.isFavorite
      }));
    });


    if (oldTaskEditComponent && oldTaskComponent) {
      replace(this._tasksCardComponent, oldTaskComponent);
      replace(this._taskEditComponent, oldTaskEditComponent);
    } else {
      render(this._container, this._tasksCardComponent, RenderPosition.BEFOREEND);
    }

  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  _replaceTaskToEdit() {
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._onViewChange();
    replace(this._taskEditComponent, this._tasksCardComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToTask() {
    this._taskEditComponent.reset();
    replace(this._tasksCardComponent, this._taskEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

}

