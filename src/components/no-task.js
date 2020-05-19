import AbstractComponent from "./abstract_component";

const createNoTaskTemplate = (load) => {
  return (
    `<section class="board container">
      <p class="board__no-tasks">
      ${load ? `Loading... ` : `Click «ADD NEW TASK» in menu to create your first task`}
      </p>
    </section>`
  );
};

export default class NoTask extends AbstractComponent {
  constructor(load = false) {
    super();

    this._load = load;
  }

  getTemplate() {
    return createNoTaskTemplate(this._load);
  }
}
