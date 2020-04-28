import AbstractComponent from "./abstract_component";

export default class AbstractSmartComponent extends AbstractComponent {
  recoveryListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners`);
  }

  rerender() {
    const oldElement = this.getElement();
    const parentElement = oldElement.parentElement;

    this.removeElement();
    const newElement = this.getElement();

    parentElement.replaceChild(newElement, oldElement);

    this.recoveryListeners();
  }

}
