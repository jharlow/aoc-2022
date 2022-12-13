import fs from "fs";

// DO NOT RUN! VERY VERY BAD! BAD JOHN!
// DO NOT RUN! VERY VERY BAD! BAD JOHN!
// DO NOT RUN! VERY VERY BAD! BAD JOHN!

const test = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

const data = fs.readFileSync("./resources/day12.input.txt", "utf-8")

const parse = (input, all = false) => {
  return input.split(/\n/).map((row) =>
    row.split("").map((col) => {
      const upperCase = (i) => (i === "S" ? 0 : 25);
      if (all)
        return col.match(/[SE]/) ? upperCase(col) : col.charCodeAt(0) - 97;
      return col.match(/[SE]/) ? col : col.charCodeAt(0) - 97;
    })
  );
};

const day12 = (input) => {
  // data[y][x]
  const dataWithStartGoal = parse(input);
  const data = parse(input, true);

  const getCoordinates = (item, input = data) => {
    const y = input.findIndex((row) => row.some((col) => col === item));
    const x = input[y].findIndex((col) => col === item);
    return { x, y };
  };

  const getVal = ({ x, y }) => {
    if (x < 0 || y < 0) return false;
    if (x >= data[0].length || y >= data.length) return false;
    return data[y][x];
  };

  const start = getCoordinates("S", dataWithStartGoal);
  const goal = getCoordinates("E", dataWithStartGoal);
  let paths = [[start]];

  // console.table(dataWithStartGoal);

  const nextSteps = (path) => {
    const currentStep = path[path.length - 1]
    const currentVal = getVal(currentStep);
    const { x: curX, y: curY } = currentStep;
    const isValidOption = ({ x, y }) => {
      if (x < 0 || y < 0) return false;
      if (x >= data[0].length || y >= data.length) return false;
      if (
        path.some(
          (coord, i) => i !== path.length - 1 && coord.x === x && coord.y === y
        )
      )
        return false;
      if (getVal({ x, y }) > currentVal + 1) return false;
      return { x, y };
    };
    return {
      up: isValidOption({ x: curX, y: curY - 1 }),
      down: isValidOption({ x: curX, y: curY + 1 }),
      left: isValidOption({ x: curX - 1, y: curY }),
      right: isValidOption({ x: curX + 1, y: curY }),
    };
  };

  let stepCounter = 0;
  let correctPath = null;
  const step = (paths) => {
    const nextStep = paths.flatMap((path) => {
      const options = nextSteps(path);
      const filteredOptions = Object.entries(options)
        .map((opt) => opt[1] || false)
        .filter((opt) => opt);

      return Array(filteredOptions.length)
        .fill()
        .map((_, i) => {
          const copiedPath = [...path];
          const option = filteredOptions[i];
          const optionIsGoal = getVal(option) === 25;
          copiedPath.push(optionIsGoal || option);
          return copiedPath;
        });
    });

    if (nextStep.some((path) => path[path.length - 1] === true)) {
      correctPath = nextStep.find((path) => path[path.length - 1] === true);
      return
    }
    if (stepCounter > 100) {
      return;
    }

    stepCounter++;
    step(nextStep);
  };

  step(paths);
  console.log(correctPath)
  

  // DO NOT RUN! VERY VERY BAD! BAD JOHN!
};

day12(data);
