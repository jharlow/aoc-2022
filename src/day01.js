import fs from "fs";

const day01 = () => {
  const data = fs.readFileSync("./resources/day01.input.txt", "utf-8");
  const emptyNewLineRegex = /(?:\h*\n){2,}/;

  const caloriesSplitByElf = data.split(emptyNewLineRegex);

  const totalCaloriesSplitByElf = caloriesSplitByElf
    .map((setOfCalories) => {
      const arrayOfCalories = setOfCalories
        .split(/\n/)
        .map((val) => Number(val));
      const caloriesTotal = arrayOfCalories.reduce((a, b) => a + b);
      return caloriesTotal;
    })
    .sort((a, b) => (a > b ? -1 : 1));

  // PUZZLE 1 SOLUTION return totalCaloriesSplitByElf[0]
  return totalCaloriesSplitByElf.splice(0, 3).reduce((a, b) => a + b, 0);
};

console.log(day01());