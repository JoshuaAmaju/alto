export function randomRange(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffle<T>(array: T[]) {
  const arr = [...array];
  let counter = arr.length;

  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;

    let tmp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = tmp;
  }

  return arr;
}

export function insertAt<T>(array: T[], insertion: T[], position: number) {
  const arr = [...array];
  const top = arr.slice(0, position);
  const bottom = arr.slice(position);
  arr.splice(0, arr.length, ...([] as T[]).concat(top, insertion, bottom));
  return arr;
}
