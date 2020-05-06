import TaskEditComponent from "../components/edit-task";
import TasksCardComponent from "../components/task-card";
import {render, RenderPosition, replace, remove} from "../utils/render";
import {DAYS, COLOR} from "../const";

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyTask = {
  description: ``,
  dueDate: null,
  repeatingDays: DAYS.reduce((acc, day) => {
    acc[day] = false;
    return acc;
  }, {}),
  color: COLOR.BLACK,
  isArchive: false,
  isFavorite: false
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

  render(task, mode) {
    const oldTaskComponent = this._tasksCardComponent;
    const oldTaskEditComponent = this._taskEditComponent;

    this._mode = mode;

    this._tasksCardComponent = new TasksCardComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);

    this._taskEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, task, null));

    this._tasksCardComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
    });

    this._taskEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._taskEditComponent.getData();
      this._onDataChange(this, task, data);
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

    switch (mode) {
      case Mode.DEFAULT:
        if (oldTaskEditComponent && oldTaskComponent) {
          replace(this._tasksCardComponent, oldTaskComponent);
          replace(this._taskEditComponent, oldTaskEditComponent);
          this._replaceEditToTask();
        } else {
          render(this._container, this._tasksCardComponent, RenderPosition.BEFOREEND);
        }
        break;

      case Mode.ADDING:
        if (oldTaskEditComponent && oldTaskComponent) {
          remove(oldTaskComponent);
          remove(oldTaskEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._taskEditComponent, RenderPosition.AFTERBEGIN);
        break;
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
    if (document.contains(this._taskEditComponent.getElement())) {
      replace(this._tasksCardComponent, this._taskEditComponent);
    }

    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyTask, null);
      }
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  destroy() {
    remove(this._taskEditComponent);
    remove(this._tasksCardComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

}

