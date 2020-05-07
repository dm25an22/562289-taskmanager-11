export const COLOR = {
  BLACK: `black`,
  YELLOW: `yellow`,
  BLUE: `blue`,
  GREEN: `green`,
  PINK: `pink`
};

const COLORS = Object.values(COLOR);

const DAYS = [`mo`, `tu`, `we`, `th`, `fr`, `sa`, `su`];
const FILTRT_TITLES = [`all`, `overdue`, `today`, `favorites`, `repeating`, `archive`];

const FilterType = {
  ALL: `all`,
  OVERDUE: `overdue`,
  TODAY: `today`,
  FAVORITES: `favorites`,
  REPEATING: `repeating`,
  ARCHIVE: `archive`,
};

const MONTH_NAMES = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`,
];

export {COLORS, DAYS, FILTRT_TITLES, MONTH_NAMES, FilterType};
