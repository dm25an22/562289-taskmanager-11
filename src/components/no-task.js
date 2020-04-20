import AbstractComponent from "./abstract_component";

const createNoTaskTemplate = () => {
  return (
    `<section class="board container">
      <p class="board__no-tasks">
        Click «ADD NEW TASK» in menu to create your first task
      </p>
    </section>`
  );
};

export default class NoTask extends AbstractComponent {
  getTemplate() {
    return createNoTaskTemplate();
  }
}
