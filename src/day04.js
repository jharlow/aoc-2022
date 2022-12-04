import fs from "fs";

const data = fs
  .readFileSync("./resources/day04.input.txt", "utf-8")
  .split(/\n/)
  .map((pair) => {
    return pair
      .split(",")
      .map((elf) => {
        return elf.split("-").map((section) => Number(section));
      })
      .map((elf) => {
        return [...Array(elf[1] - elf[0] + 1)].map((_, i) => elf[0] + i);
      });
  });

const day04 = () => {
  return data.filter((pair) => {
    const elf1 = pair[0];
    const elf2 = pair[1];
    // PART 1
    // const elf1SectionsCoveredByElf2 = elf1.every((e1n) =>
    //   elf2.some((e2n) => e2n === e1n)
    // );
    // const elf2SectionsCoveredByElf1 = elf2.every((e2n) =>
    //   elf1.some((e1n) => e2n === e1n)
    // );
    // if (elf1SectionsCoveredByElf2 || elf2SectionsCoveredByElf1) return true;
    // PART 2
    const anySectionsOverlap = elf1.some((e1n) =>
      elf2.some((e2n) => e1n === e2n)
    );
    if (anySectionsOverlap) return true;
    else return false;
  }).length;
};

console.log(day04());
