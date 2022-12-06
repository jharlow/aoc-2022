import fs from "fs";

const data = fs.readFileSync("./resources/day05.input.txt", "utf-8");

const parse = (data) => {
  let [map, instructions] = data.split("\n\n");
  map = map
  .split(/\n/)
  .map((crateLevel) => crateLevel.match(/.{1,4}/g))
  .slice(0, map.length-1)
  .map((_, i, arr) =>
    // change each array from being a row to a column
    arr
      .map((line) => line[i])
      .filter((item) => item.match(/[A-Z]/i))
      .map((item) => item.match(/[A-Z]/i)[0])
      .reverse()
  )

  instructions = instructions.split(/\n/).map((line) => {
    const info = line
      .split(" ")
      .filter((item) => Number(item))
      .map((n) => Number(n));
    return { move: info[0], from: info[1] - 1, to: info[2] - 1 };
  });
  console.log(map)
  return { crates: map, instructions };
};

const day05 = (input, singles = true) => {
  const { crates, instructions } = parse(input);
  for (const { move, from, to } of instructions) {
    const removed = crates[from].splice(crates[from].length - move);
    if (singles) removed.reverse();
    crates[to].push(...removed);
  }
  return crates.map((x) => x.pop()).join("");
};

console.log(day05(data, true));
