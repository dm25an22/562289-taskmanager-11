import {getRandomItem, getRandomBoolean, generateRepeatingDays, getRandomDate} from "../utils";
import {COLORS} from "../const";

const TASK_COUNT = 20;

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

const generateMock = () => {
  const dueDate = getRandomBoolean() ? null : getRandomDate();

  return {
    color: getRandomItem(COLORS),
    description: getRandomItem(DescriptionItems),
    isArchive: getRandomBoolean(),
    isFavorite: getRandomBoolean(),
    dueDate,
    repeatingDays: dueDate ? DefaultRepeatingDays : generateRepeatingDays(PropertyDefaultRepeatingDays),

  };
};

const renderTaskData = (countTask) => {
  return new Array(countTask)
    .fill()
    .map(generateMock);
};

export const taskData = renderTaskData(TASK_COUNT);


