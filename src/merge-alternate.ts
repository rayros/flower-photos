export const mergeAlternate = <T extends any>(arrays: T[][]) => {
  const result: T[] = [];
  const l = Math.min(...arrays.map((array) => array.length));

  for (let i = 0; i < l; i++) {
    result.push(...arrays.map((array) => array[i]));
  }
  const rest = arrays
    .map((array) => array.slice(l))
    .reduce((a, b) => a.concat(b));
  result.push(...rest);
  return result;
};
