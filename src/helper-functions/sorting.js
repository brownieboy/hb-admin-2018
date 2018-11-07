// From https://stackoverflow.com/questions/42563177/sort-array-of-objects-by-property
export const stringSort = (array, keyString) =>
  array.sort(
    (a, b) =>
      (typeof a[keyString] === "string") - (typeof b[keyString] === "string") ||
      a[keyString] - b[keyString] ||
      a[keyString].localeCompare(b[keyString])
  );

export const stringSortIgnoreArticle = (array, keyString) =>
  array.sort(
    (a, b) =>
      (typeof a[keyString] === "string") - (typeof b[keyString] === "string") ||
      a[keyString] - b[keyString] ||
      a[keyString].replace(/^The /, "").localeCompare(b[keyString].replace(/^The /, ""))
  );

export const stringThenDateTimeSort = (array, keyString, keyDateTime) =>
  array.sort(
    (a, b) =>
      (typeof a[keyString] === "string") - (typeof b[keyString] === "string") ||
      a[keyString] - b[keyString] ||
      a[keyString].localeCompare(b[keyString]) ||
      new Date(a[keyDateTime]) - new Date(b[keyDateTime])
  );
