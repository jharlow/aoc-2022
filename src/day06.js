import fs from "fs";

const data = fs.readFileSync("./resources/day06.input.txt", "utf-8").split("");

const day06 = (distinct) => {
  if (typeof distinct !== "number")
    throw new Error("Must provide length of distinct marker!");
  return data.findIndex((_, i) => {
    if (i <= distinct - 1) return false;
    const marker = data.slice(i - distinct, i);
    const uniques = [...new Set(marker)];
    if (uniques.length === distinct) return true;
    else return false;
  });
};

console.log(day06(14));
