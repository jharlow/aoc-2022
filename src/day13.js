import fs from "fs";

const data = fs.readFileSync("./resources/day13.input.txt", "utf-8");

const parse = (input) =>
  input
    .split(/\n\n/)
    .map((line) => line.split(/\n/).map((packet) => JSON.parse(packet)));

const inRightOrder = (left, right) => {
  const leftType = typeof left;
  const rightType = typeof right;

  if (leftType === rightType) {
    if (leftType === "number" && left !== right) {
      return left < right;
    }
    if (leftType === "object") {
      const longestArr =
        left.length < right.length ? right.length : left.length;
      for (let i = 0; i < longestArr; i++) {
        const listLeft = left[i];
        const listRight = right[i];
        if (listLeft === undefined) return true;
        if (listRight === undefined) return false;
        const other = inRightOrder(listLeft, listRight);
        if (other === true || other === false) return other;
      }
    }
  }

  if (leftType !== rightType) {
    const adaptLeft = leftType === "number" ? [left] : left;
    const adaptRight = rightType === "number" ? [right] : right;
    return inRightOrder(adaptLeft, adaptRight);
  }
};

const dividerPackets = [[[2]], [[6]]];

const day13 = (input, part) => {
  if (part === 1)
    return parse(input)
      .map((pair, i) => {
        const [leftPack, rightPack] = pair;
        return {
          index: i + 1,
          correctOrder: inRightOrder(leftPack, rightPack),
        };
      })
      .filter((pair) => pair.correctOrder)
      .reduce((tot, curr) => tot + curr.index, 0);

  if (part === 2)
    return parse(input)
      .flatMap((pair) => [...pair])
      .concat(dividerPackets)
      .sort((a, b) => (inRightOrder(a, b) ? -1 : 1))
      .map((packet, i) => {
        return {
          index: i + 1,
          packet: JSON.stringify(packet),
        };
      })
      .filter((packet) =>
        dividerPackets.some(
          (divPack) => JSON.stringify(divPack) === packet.packet
        )
      )
      .reduce((a, b) => a * b.index, 1)
};

console.log(`Part 1: ${day13(data, 1)}`);
console.log(`Part 2: ${day13(data, 2)}`);
