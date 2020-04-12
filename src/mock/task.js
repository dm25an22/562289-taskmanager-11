const TASK_COUNT = 20;

import {COLORS} from "../const";

const DefaultRepeatingDays = {
  "mo": false,
  "tu": false,
  "we": false,
  "th": false,
  "fr": false,
  "sa": false,
  "su": false,
};

const PropertyDefaultRepeatingDays = Object.keys(DefaultRepeatingDays);

const DescriptionItems = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`,
];

const getRandomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomItem = (arr) => {
  return arr[getRandomNumber(0, arr.length - 1)];
};

const getRandomBoolean = () => Math.random() > 0.5;

const generateRepeatingDays = () => {
  const randomDay = getRandomItem(PropertyDefaultRepeatingDays);

  return Object.assign({}, DefaultRepeatingDays, {
    [randomDay]: getRandomBoolean(),
  });
};

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomNumber(0, 7);

  targetDate.setDate(targetDate.getDate() + diffValue);
  targetDate.setHours(getRandomNumber(0, 12), getRandomNumber(0, 59));

  return targetDate;
};


const generateMock = () => {
  const dueDate = Math.random() > 0.5 ? null : getRandomDate();

  return {
    color: getRandomItem(COLORS),
    description: getRandomItem(DescriptionItems),
    isArchive: getRandomBoolean(),
    isFavorite: getRandomBoolean(),
    dueDate,
    repeatingDays: dueDate ? DefaultRepeatingDays : generateRepeatingDays(),

  };
};

const renderTaskData = (countTask) => {
  return new Array(countTask)
    .fill()
    .map(generateMock);
};

export const taskData = renderTaskData(TASK_COUNT);


