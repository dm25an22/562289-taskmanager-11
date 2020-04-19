import {createElement} from "../utils";

const createNoTaskTemplate = () => {
  return (
    `<section class="board container">
      <p class="board__no-tasks">
        Click «ADD NEW TASK» in menu to create your first task
      </p>
    </section>`
  );
};

export default class NoTask {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createNoTaskTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  ronoveElement() {
    this._element = null;
  }
}
