import AbstractComponent from "./abstract_component";


const createLoadButton = () => {
  return (
    `<button class="load-more" type="button">load more</button>`
  );
};

export default class LoadButton extends AbstractComponent {
  getTemplate() {
    return createLoadButton();
  }

  setClickHandler(hendler) {
    this.getElement().addEventListener(`click`, hendler);
  }

}


