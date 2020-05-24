import TaskEditComponent from "../components/edit-task";
import TasksCardComponent from "../components/task-card";
import {render, RenderPosition, replace, remove} from "../utils/render";
import {DAYS, COLOR} from "../const";
import TaskModel from "../models/task";


const SHAKE_ANIMATION_TIMEOUT = 600;

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

const color = {
  BLACK: `black`,
  RED: `red`
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

const dataParse = (formData) => {
  const repeatingDays = DAYS.reduce((acc, day) => {
    acc[day] = false;
    return acc;
  }, {});

  const date = formData.get(`date`);

  return new TaskModel({
    "description": formData.get(`text`),
    "due_date": date ? new Date(date) : null,
    "repeating_days": formData.getAll(`repeat`).reduce((acc, it) => {
      acc[it] = true;
      return acc;
    }, repeatingDays),
    "color": formData.get(`color`),
    "is_favorite": false,
    "is_done": false,
  });
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

    this._taskEditComponent.setDeleteButtonClickHandler(() => {
      this._taskEditComponent.setData({deleteButtonText: `Deleting...`});
      this._onDataChange(this, task, null);
    });

    this._tasksCardComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
    });

    this._taskEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const formData = this._taskEditComponent.getData();
      const data = dataParse(formData);
      this._taskEditComponent.setData({saveButtonText: `Saving...`});
      this._taskEditComponent.blockForm();
      this._taskEditComponent.borderEdit(color.BLACK);
      this._onDataChange(this, task, data);
    });

    this._tasksCardComponent._setArchiveButtonClickHandler(() => {
      const newTask = TaskModel.clone(task);
      newTask.isArchive = !newTask.isArchive;
      this._onDataChange(this, task, newTask);
    });

    this._tasksCardComponent._setFavoritesButtonClickHandler(() => {
      const newTask = TaskModel.clone(task);
      newTask.isFavorite = !newTask.isFavorite;
      this._onDataChange(this, task, newTask);
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

  shake() {
    this._tasksCardComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._taskEditComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._tasksCardComponent.getElement().style.animation = ``;
      this._taskEditComponent.getElement().style.animation = ``;


      this._taskEditComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`,
      });
      this._taskEditComponent.borderEdit(color.RED);
    }, SHAKE_ANIMATION_TIMEOUT);

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

