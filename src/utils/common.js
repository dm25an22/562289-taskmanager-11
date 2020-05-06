import {SortType} from "../components/sort";
import moment from "moment";

const formatTime = (date) => {
  return moment(date).format(`hh:mm`);
};

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM`);
};

const getRandomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomItem = (arr) => {
  return arr[getRandomNumber(0, arr.length - 1)];
};

const getRandomBoolean = () => Math.random() > 0.5;

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomNumber(0, 7);

  targetDate.setDate(targetDate.getDate() + diffValue);
  targetDate.setHours(getRandomNumber(0, 23), getRandomNumber(0, 59));

  return targetDate;
};

const getSortedTasks = (tasks, sortType, from, to) => {
  const tasksCopy = [...tasks];
  let sortedTasks = [];

  switch (sortType) {
    case SortType.DATE_UP:
      sortedTasks = tasksCopy.sort((a, b) => a.dueDate - b.dueDate);
      break;

    case SortType.DATE_DOWN:
      sortedTasks = tasksCopy.sort((a, b) => b.dueDate - a.dueDate);
      break;

    case SortType.DEFAULT:
      sortedTasks = tasks;
  }

  return sortedTasks.slice(from, to);
};

export {
  formatTime,
  getRandomNumber,
  getRandomItem,
  getRandomBoolean,
  getRandomDate,
  getSortedTasks
};

