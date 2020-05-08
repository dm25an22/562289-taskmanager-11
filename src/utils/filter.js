import {FilterType} from "../const.js";
import {isOneDay, isOverdueDate} from "../utils/common";


export const getArchiveTasks = (tasks) => {
  return tasks.filter((task) => task.isArchive);
};

export const getNotArchiveTasks = (tasks) => {
  return tasks.filter((task) => !task.isArchive);
};

export const getFavoriteTasks = (tasks) => {
  return tasks.filter((task) => task.isFavorite);
};

export const getRepeatingTasks = (tasks) => {
  return tasks.filter((task) => Object.values(task.repeatingDays).some(Boolean));
};

export const getTodayTasks = (tasks, date) => {
  return tasks.filter((it) => isOneDay(it.dueDate, date));
};

export const getOverdueTasks = (tasks, date) => {
  return tasks.filter((it) => {
    if (!it.dueDate) {
      return false;
    }

    return isOverdueDate(it.dueDate, date);
  });
};

export const getTasksByFilter = (allTasks, filterName) => {
  const date = new Date();

  switch (filterName) {
    case FilterType.ALL:
      return getNotArchiveTasks(allTasks);

    case FilterType.ARCHIVE:
      return getArchiveTasks(allTasks);

    case FilterType.FAVORITES:
      return getFavoriteTasks(getNotArchiveTasks(allTasks));

    case FilterType.REPEATING:
      return getRepeatingTasks(getNotArchiveTasks(allTasks));

    case FilterType.TODAY:
      return getTodayTasks(getNotArchiveTasks(allTasks), date);

    case FilterType.OVERDUE:
      return getOverdueTasks(getNotArchiveTasks(allTasks), date);
  }

  return allTasks;
};


