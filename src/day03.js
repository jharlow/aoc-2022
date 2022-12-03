import fs from "fs";

const getItemPriority = (item) => {
  const lowerCase = "abcdefghijklmnopqrstuvwxyz";
  const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const itemIsLowerCase = () =>
    lowerCase.split("").some((char) => char === item);
  if (itemIsLowerCase()) {
    return lowerCase.split("").findIndex((char) => char === item) + 1;
  } else {
    return upperCase.split("").findIndex((char) => char === item) + 27;
  }
};

const findMissingItem = (compartments) => {
  const slicedCompartments = compartments.map((comp) => comp.split(""));
  const firstCompartmentIndex = slicedCompartments[0].findIndex((c1Item) =>
    slicedCompartments[1].some((c2Item) => c1Item === c2Item)
  );
  const missingItem = slicedCompartments[0][firstCompartmentIndex];
  return missingItem;
};

const day03Part1 = () => {
  const newLineRegex = /[\r\n]+/;
  const data = fs.readFileSync("./resources/day03.input.txt", "utf-8");
  const answer = data
    .split(newLineRegex)
    .map((backpack) => {
      const halfOfBackpack = backpack.length / 2;
      const compartments = [
        backpack.slice(0, halfOfBackpack),
        backpack.slice(halfOfBackpack, backpack.length),
      ];
      const missingItem = findMissingItem(compartments);
      return getItemPriority(missingItem);
    })
    .reduce((a, b) => a + b, 0);
  return answer;
};

const findMissingBadge = (group) => {
  const slicedGroup = group.map((comp) => comp.split(""));
  const firstCompartmentIndex = slicedGroup[0].findIndex((e1Item) => {
    const itemPresentInElf2 = slicedGroup[1].some(
      (e2Item) => e1Item === e2Item
    );
    const itemPresentInElf3 = slicedGroup[2].some(
      (e3Item) => e1Item === e3Item
    );
    if (itemPresentInElf2 && itemPresentInElf3) return true;
    else return false;
  });
  const missingBadge = slicedGroup[0][firstCompartmentIndex];
  return getItemPriority(missingBadge);
};

const day03Part2 = () => {
  const newLineRegex = /[\r\n]+/;
  const data = fs.readFileSync("./resources/day03.input.txt", "utf-8").split(newLineRegex)

  const numberOfGroups = data.length / 3;
  const answer = [...Array(numberOfGroups)]
    .map((_, groupNumber) => {
      const startingIndex = groupNumber * 3;
      const elf1 = data[startingIndex];
      const elf2 = data[startingIndex + 1];
      const elf3 = data[startingIndex + 2];
      const groupOfElves = [elf1, elf2, elf3];
      const missingBadge = findMissingBadge(groupOfElves);
      return missingBadge;
    })
    .reduce((a, b) => a + b, 0);

  return answer
};

console.log(`Part 1: ${day03Part1()}`)
console.log(`Part 2: ${day03Part2()}`)
