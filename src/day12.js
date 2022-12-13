// DO NOT RUN! VERY VERY BAD! BAD JOHN!
// DO NOT RUN! VERY VERY BAD! BAD JOHN!
// DO NOT RUN! VERY VERY BAD! BAD JOHN!

const test = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

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
    return data[y][x];
  };

  const start = getCoordinates("S", dataWithStartGoal);
  const goal = getCoordinates("E", dataWithStartGoal);
  let paths = [[start]];

  console.table(dataWithStartGoal);

  const nextSteps = (coordinates, formerCoordinates) => {
    const currentVal = getVal({ ...coordinates });
    let formerRelativeToCurr = null;
    const { x: curX, y: curY } = coordinates;
    const { x: forX, y: forY } = formerCoordinates || { x: -2, y: -2 };
    if (forY + 1 === curY) formerRelativeToCurr = "up";
    if (forY - 1 === curY) formerRelativeToCurr = "down";
    if (forX + 1 === curX) formerRelativeToCurr = "left";
    if (forX - 1 === curX) formerRelativeToCurr = "right";
    const isValidOption = ({ x, y }) => {
      if (x < 0 || y < 0) return false;
      if (x >= data[0].length || y >= data.length) return false
      if (getVal({ x, y }) > currentVal + 1) return false;
      return { x, y };
    };
    return {
      up:
        formerRelativeToCurr === "up"
          ? false
          : isValidOption({ x: curX, y: curY - 1 }),
      down:
        formerRelativeToCurr === "down"
          ? false
          : isValidOption({ x: curX, y: curY + 1 }),
      left:
        formerRelativeToCurr === "left"
          ? false
          : isValidOption({ x: curX - 1, y: curY }),
      right:
        formerRelativeToCurr === "right"
          ? false
          : isValidOption({ x: curX + 1, y: curY }),
    };
  };

  let stepCounter = 0;
  const step = (paths) => {
    const nextStep = paths.flatMap((path) => {
      const options = nextSteps(path[path.length - 1], path[path.length - 2]);
      const filteredOptions = Object.entries(options)
        .map((opt) => opt[1] || false)
        .filter((opt) => opt);
      return Array(filteredOptions.length)
        .fill()
        .map((_, i) => {
          const copiedPath = [...path];
          const option = filteredOptions[i]
          const optionIsGoal = getVal(option) === 25
          copiedPath.push(optionIsGoal || option);
          return copiedPath;
        });
    });

    if (nextStep.some((step) => step[step.length - 1] === true)) return paths
    
    stepCounter++;
    // console.log(paths)
    if (stepCounter > 1000) return paths
    step(nextStep);
  };

  console.log(step(paths).length)

  // DO NOT RUN! VERY VERY BAD! BAD JOHN!
};

day12(test);
