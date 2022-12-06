import fs from "fs";

const testData = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

const data = fs.readFileSync("./resources/day05.input.txt", "utf-8");
const emptyNewLineRegex = /(?:\h*\n){2,}/;
// crates[x: 0 = left][y: 0 = bottom]
const crates = data
  .split(emptyNewLineRegex)[0]
  .split(/\n/)
  .map((crateLevel) => crateLevel.match(/.{1,4}/g))
  .slice(0, -1)
  .map((_, i, arr) =>
    // change each array from being a row to a column
    arr
      .map((line) => line[i])
      .filter((item) => item.match(/[A-Z]/i))
      .map((item) => item.match(/[A-Z]/i)[0])
      .reverse()
  )
  .concat([[], [], []]);

// [instructions] 0 = move, 1 = from, 2 = to
const instructions = data
  .split(emptyNewLineRegex)[1]
  .split(/\n/)
  .map((line) =>
    line
      .split(" ")
      .filter((item) => Number(item))
      .map((n) => Number(n))
  );

const completeInstruction = (crates, instruction) => {
  const move = instruction[0];
  const from = instruction[1] - 1;
  const to = instruction[2] - 1;
  const movingCrates = crates[from].splice(-move).reverse()
  crates[to].push(...movingCrates)
};

const day05 = () => {
  instructions.forEach((instruction) =>
    completeInstruction(crates, instruction)
  );
  return crates.map((stack) => stack[stack.length - 1]).join("");
};

console.log(day05());
console.table(crates);
