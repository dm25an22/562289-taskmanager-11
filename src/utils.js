import {RenderPosition} from "./const";

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
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

const generateRepeatingDays = (arrValues) => {
  const randomDay = getRandomItem(arrValues);

  return Object.assign({}, arrValues, {
    [randomDay]: getRandomBoolean(),
  });
};

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomNumber(0, 7);

  targetDate.setDate(targetDate.getDate() + diffValue);
  targetDate.setHours(getRandomNumber(0, 23), getRandomNumber(0, 59));

  return targetDate;
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;

    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};


export {
  formatTime,
  getRandomNumber,
  getRandomItem,
  getRandomBoolean,
  generateRepeatingDays,
  getRandomDate,
  createElement,
  render
};

