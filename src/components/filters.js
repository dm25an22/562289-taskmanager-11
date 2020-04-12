const renderFilterMurjup = (filters, isChecked) => {
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

export const createMainFiltersTemplate = (filterData) => {
  const filtersMarkup = filterData.map((it, i) => {
    return renderFilterMurjup(it, i === 0);
  }).join(`\n`);

  return (
    `<section class="main__filter filter container">
        ${filtersMarkup}
    </section>`
  );
};
