import {taskData} from "./task";

const filterTitles = [`all`, `overdue`, `today`, `favorites`, `repeating`, `archive`];

const taskDataCards = taskData.slice(1);


const counterFilters = {
  all: taskDataCards.length,
  overdue: 0,
  today: 0,
  favorites: 0,
  repeating: 0,
  archive: 0
};

for (let i = 0; i < taskDataCards.length; i++) {
  const {isArchive, isFavorite, dueDate, repeatingDays} = taskDataCards[i];

  const isExpired = dueDate instanceof Date && dueDate < Date.now();
  const isToday = dueDate instanceof Date && dueDate.getDate() === new Date().getDate();
  const isRepeat = Object.values(repeatingDays).some(Boolean);

  counterFilters.overdue += isExpired ? 1 : 0;
  counterFilters.today += isToday ? 1 : 0;
  counterFilters.favorites += isFavorite ? 1 : 0;
  counterFilters.repeating += isRepeat ? 1 : 0;
  counterFilters.archive += isArchive ? 1 : 0;
}

const renderMockData = (filters) => {
  return filters.map((it) => {
    return {
      title: it,
      count: counterFilters[it]
    };
  });
};

export const filterMock = renderMockData(filterTitles);

