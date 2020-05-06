import {FilterType} from "../const.js";


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

export const getTodayTasks = (tasks) => {
  return tasks.filter((it) => it.dueDate && it.dueDate.getDate() === new Date().getDate());
};

export const getOverdueTasks = (tasks) => {
  return tasks.filter((it) => it.dueDate && it.dueDate < new Date());
};

export const getTasksByFilter = (allTasks, filterName) => {
  switch (filterName) {
    case FilterType.ALL:
      return getNotArchiveTasks(allTasks);

    case FilterType.ARCHIVE:
      return getArchiveTasks(allTasks);

    case FilterType.FAVORITES:
      return getFavoriteTasks(allTasks);

    case FilterType.REPEATING:
      return getRepeatingTasks(allTasks);

    case FilterType.TODAY:
      return getTodayTasks(allTasks);
    
    case FilterType.OVERDUE:
      return getOverdueTasks(allTasks);
  }

  return allTasks;
};


