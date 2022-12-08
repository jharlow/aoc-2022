import fs from "fs";

const data = fs
  .readFileSync("./resources/day08.input.txt", "utf-8")
  .split(/\n/)
  .map((row) => row.split("").map((tree) => Number(tree)));

const get = (type, dir, row, col) => {
  const isVisible = (arr) =>
    arr.every((item, i) => i + 1 === arr.length || item < arr[arr.length - 1]);

  const distance = (arr) =>
    arr
      .reverse()
      .findIndex(
        (val, i) => (i !== 0 && val >= arr[0]) || i === arr.length - 1
      );

  const getValue = (arr) =>
    type === "ifVisible" ? isVisible(arr) : distance(arr);

  if (dir === "left" || dir === "right") {
    const getRow = data[row];
    return dir === "left"
      ? getValue(getRow.filter((_, i) => i <= col))
      : getValue(getRow.filter((_, i) => i >= col).reverse());
  }
  if (dir === "up" || dir === "down") {
    const getCol = data.map((row) => row[col]);
    return dir === "up"
      ? getValue(getCol.filter((_, i) => i <= row))
      : getValue(getCol.filter((_, i) => i >= row).reverse());
  }
};

const treeVisible = (row, col) => {
  const directions = ["up", "down", "left", "right"];
  return directions
    .map((dir) => get("ifVisible", dir, row, col))
    .some((treeVisible) => treeVisible);
};

const scenicScore = (row, col) => {
  const directions = ["up", "down", "left", "right"];
  return directions
    .map((dir) => get("viewDistance", dir, row, col))
    .reduce((a, b) => a * b, 1);
};

const day08 = (part) => {
  if (part === 1)
    return data
      .map((row, rowN) => row.map((_, colN) => treeVisible(rowN, colN)))
      .join()
      .split(",")
      .reduce((a, b) => {
        const addition = b === "true" ? 1 : 0;
        return a + addition;
      }, 0);

  if (part === 2)
    return data
      .map((row, rowN) => row.map((_, colN) => scenicScore(rowN, colN)))
      .join()
      .split(",")
      .sort((a, b) => b - a)[0];
};

console.info(`Part 1: ${day08(1)}`);
console.info(`Part 2: ${day08(2)}`);
