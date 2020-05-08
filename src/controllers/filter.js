import {FilterType} from "../const";
import FilterComponent from "../components/filters";
import {render, replace, RenderPosition} from "../utils/render.js";
import {getTasksByFilter} from "../utils/filter";


export default class FilterController {
  constructor(container, tasksModel) {
    this._container = container;
    this._tasksModel = tasksModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._onDataFilterChange = this._onDataFilterChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._tasksModel.setDataChangeHandlers(this._onDataFilterChange);
  }

  render() {
    const container = this._container;
    const allTasks = this._tasksModel.getTasksAll();

    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getTasksByFilter(allTasks, filterType).length,
        checked: this._activeFilterType === filterType
      };
    });

    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);
    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.BEFOREEND);
    }

  }

  getFilterType() {
    return this._activeFilterType;
  }

  resetFilter() {
    if (this._activeFilterType === FilterType.ALL) {
      return;
    }
    this._activeFilterType = FilterType.ALL;
    this._tasksModel.setFilter(FilterType.ALL);
    this.render();
  }

  _onFilterChange(filterName) {
    this._activeFilterType = filterName;
    this._tasksModel.setFilter(filterName);
  }

  _onDataFilterChange() {
    this.render();
  }

}
