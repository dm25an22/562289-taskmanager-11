import AbstractComponent from "./abstract_component";

const createBoardTemplate = () => {
  return (
    `<section class="board container">  
    </section>`
  );
};

export default class Board extends AbstractComponent {
  getTemplate() {
    return createBoardTemplate();
  }
}

