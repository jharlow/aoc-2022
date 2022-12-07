import fs from "fs";

const data = fs.readFileSync("./resources/day06.input.txt", "utf-8").split("");

const day06 = (distinct) => {
  return data.findIndex((_, i) => {
    if (i <= distinct - 1) return false;
    const marker = data.slice(i - distinct, i);
    const uniques = [...new Set(marker)];
    return (uniques.length === distinct)
  });
};

console.log(day06(14));
