import {COLORS, DAYS} from '../const';
import {formatTime, formatDate} from '../utils/common';
import AbstractSmartComponent from "./abstract-smart-component";
import {encode} from "he";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const MIN_DESCRIPTION_LENGTH = 1;
const MAX_DESCRIPTION_LENGTH = 140;

const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
};

const isRepeating = (repeatingDays) => {
  return Object.values(repeatingDays).some(Boolean);
};

const isAllowableDescriptionLength = (description) => {
  const length = description.length;
  return length >= MIN_DESCRIPTION_LENGTH && length <= MAX_DESCRIPTION_LENGTH;
};

const createRepeatingDaysMarkup = (days, repeatingDays) => {
  return days.map((day, index) => {
    const isChecked = repeatingDays[day];

    return `<input
        class="visually-hidden card__repeat-day-input"
        type="checkbox"
        id="repeat-${day}-${index}"
        name="repeat"
        value="${day}"
        ${isChecked ? `checked` : ``}
        />
        <label class="card__repeat-day" for="repeat-${day}-${index}"
        >${day}</label
      >`;
  }).join(`\n`);
};

const createColorsMarkup = (colors, currentColor) => {
  return colors.map((color, index) => {
    return (
      `<input
        type="radio"
        id="color-${color}-${index}"
        class="card__color-input card__color-input--${color} visually-hidden"
        name="color"
        value="${color}"
        ${currentColor === color ? `checked` : ``}
      />
      <label
        for="color-${color}-${index}"
        class="card__color card__color--${color}"
        >black</label
      >`
    );
  }).join(`\n`);
};


const createAddTaskTemplate = (options = {}) => {
  const {isDateShowing, isRepeatingTask, activeRepeatingDays, color, currentDescription, dueDate, externalData} = options;

  const description = encode(currentDescription);
  const isExpired = dueDate instanceof Date && dueDate < Date.now();

  const isBlockSaveButton = (isDateShowing && isRepeatingTask) ||
  (isRepeatingTask && !isRepeating(activeRepeatingDays)) || !isAllowableDescriptionLength(description);

  const date = (isDateShowing && dueDate) ? formatDate(dueDate) : ``;
  const time = (isDateShowing && dueDate) ? formatTime(dueDate) : ``;


  const repeatClass = isRepeatingTask ? `card--repeat` : ``;
  const deadlineClass = isExpired && isDateShowing ? `card--deadline` : ``;

  const colorsMarkup = createColorsMarkup(COLORS, color);
  const repeatingDaysMarkup = createRepeatingDaysMarkup(DAYS, activeRepeatingDays);

  const deleteButtonText = externalData.deleteButtonText;
  const saveButtonText = externalData.saveButtonText;

  return (
    `<article class="card card--edit card--${color} ${repeatClass} ${deadlineClass}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${description}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">${isDateShowing ? `yes` : `no`}</span>
                </button>
                
                ${isDateShowing ? `<fieldset class="card__date-deadline">
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      placeholder=""
                      name="date"
                      value="${date} ${time}"
                    />
                  </label>
                </fieldset>` : ``}
  

                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${isRepeatingTask ? `yes` : `no`}</span>
                </button>

                ${isRepeatingTask ? `<fieldset class="card__repeat-days">
                  <div class="card__repeat-days-inner">
                    ${repeatingDaysMarkup}
                  </div>
                </fieldset>` : ``}

              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                ${colorsMarkup}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit" ${isBlockSaveButton ? `disabled` : ``}>${saveButtonText}</button>
            <button class="card__delete" type="button">${deleteButtonText}</button>
          </div>
        </div>
      </form>
    </article>`
  );
};


export default class TaskEdit extends AbstractSmartComponent {
  constructor(task) {
    super();

    this._task = task;

    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    this._color = task.color;
    this._currentDescription = task.description;
    this._dueDate = task.dueDate;

    this._externalData = DefaultData;
    this._flatpickr = null;
    this._submitHandler = null;
    this._deleteButtonClickHandler = null;
    this._subscribeOnEvents();
    this._applyFlatpickr();
  }

  getTemplate() {
    return createAddTaskTemplate({
      isDateShowing: this._isDateShowing,
      isRepeatingTask: this._isRepeatingTask,
      activeRepeatingDays: this._activeRepeatingDays,
      color: this._color,
      currentDescription: this._currentDescription,
      dueDate: this._dueDate,
      externalData: this._externalData,
      test: this._test
    });
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this._subscribeOnEvents();
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  borderEdit(color) {
    this.getElement().querySelector(`.card__inner`).style.borderColor = color;
  }

  blockForm() {
    const elementsCollection = this.getElement().querySelector(`.card__form`).elements;
    Array.from(elementsCollection).forEach((el) => {
      el.disabled = true;
    });
  }

  reset() {
    const task = this._task;

    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    this._color = task.color;
    this._currentDescription = task.description;

    this.rerender();
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    if (this._isDateShowing) {
      const dateElement = this.getElement().querySelector(`.card__date`);
      const time = `time_24hr`;
      this._flatpickr = flatpickr(dateElement, {
        allowInput: true,
        altInput: true,
        defaultDate: this._dueDate || `today`,
        enableTime: true,
        altFormat: `d F H:i`,
        [time]: true,
      });
    }

  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  getData() {
    const element = this.getElement().querySelector(`form`);

    return new FormData(element);
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.card__text`)
      .addEventListener(`input`, (evt) => {
        this._currentDescription = evt.target.value;

        const saveButton = this.getElement().querySelector(`.card__save`);
        saveButton.disabled = !isAllowableDescriptionLength(this._currentDescription);
      });

    if (this._isDateShowing) {
      element.querySelector(`.card__date`).addEventListener(`input`, (evt) => {

        this._dueDate = new Date(evt.target.value);
      });
    }

    element.querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, () => {
        this._isDateShowing = !this._isDateShowing;
        this.rerender();
      });

    element.querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, () => {
        this._isRepeatingTask = !this._isRepeatingTask;
        this.rerender();
      });

    const repeatDays = element.querySelector(`.card__repeat-days`);
    if (repeatDays) {
      repeatDays.addEventListener(`change`, (evt) => {
        this._activeRepeatingDays[evt.target.value] = evt.target.checked;
        this.rerender();
      });
    }

    element.querySelector(`.card__colors-wrap`)
      .addEventListener(`change`, (evt) => {
        this._color = evt.target.value;

        this.rerender();
      });

  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__delete`)
      .addEventListener(`click`, handler);
    this._deleteButtonClickHandler = handler;
  }

}
