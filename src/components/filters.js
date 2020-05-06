import AbstractComponent from "./abstract_component";

const FILTER_ID_PREFIX = `filter__`;

const getFilterId = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};


const renderFilterMurkup = (filters, isChecked) => {
  const {name, count} = filters;
  return (
    `<input type="radio" id="filter__${name}"
    class="filter__input visually-hidden"
    name="filter"
    ${isChecked ? `checked` : ``}
    ${count === 0 ? `disabled` : ``}
    />
    <label for="filter__${name}" class="filter__label"> ${name} <span class="filter__${name}-count"> ${count} </span></label
    >`
  );
};

const createMainFiltersTemplate = (filterData) => {
  const filtersMarkup = filterData.map((it) => {
    return renderFilterMurkup(it, it.checked);
  }).join(`\n`);

  return (
    `<section class="main__filter filter container">
        ${filtersMarkup}
    </section>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createMainFiltersTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterId(evt.target.id);
      handler(filterName);
    });
  }

}

