import {createElement} from "../utils";

const createLoadButton = () => {
  return (
    `<button class="load-more" type="button">load more</button>`
  );
};

export default class LoadButton {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createLoadButton();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

}
