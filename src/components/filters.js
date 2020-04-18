import {createElement} from "../utils";

const renderFilterMurkup = (filters, isChecked) => {
  const {title, count} = filters;
  return (
    `<input type="radio" id="filter__${title}"
    class="filter__input visually-hidden"
    name="filter"
    ${isChecked ? `checked` : ``}
    ${count === 0 ? `disabled` : ``}
    />
    <label for="filter__${title}" class="filter__label"> ${title} <span class="filter__${title}-count"> ${count} </span></label
    >`
  );
};

const createMainFiltersTemplate = (filterData) => {
  const filtersMarkup = filterData.map((it, i) => {
    return renderFilterMurkup(it, i === 0);
  }).join(`\n`);

  return (
    `<section class="main__filter filter container">
        ${filtersMarkup}
    </section>`
  );
};

export default class Filter {
  constructor(filters) {
    this._filters = filters;

    this._element = null;
  }

  getTemplate() {
    return createMainFiltersTemplate(this._filters);
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

