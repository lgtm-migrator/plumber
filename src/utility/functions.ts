/**
 * Taken from: https://stackoverflow.com/a/5767357/10221282
 * @param array
 * @param value
 * @returns
 */
export function removeItem<T>(array: Array<T>, value: T): Array<T> {
  const index = array.indexOf(value);

  if (index > -1) {
    array.splice(index, 1);
  }

  return array;
}
