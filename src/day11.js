import fs from "fs";

const input = fs.readFileSync("./resources/day11.input.txt", "utf-8");

const test = `Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
  If true: throw to monkey 1
  If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
  If true: throw to monkey 0
  If false: throw to monkey 1`;

class Monkey {
  constructor({ startingItems, operation, test }) {
    this.items = startingItems;
    this._operationInfo = operation;
    this._test = test;
    this.inspectionCount = 0;
  }

  performOperation(item) {
    const add = (a, b) => a + b;
    const multiply = (a, b) => a * b;
    const correctOperation = this._operationInfo[1] === "+" ? add : multiply;
    const firstItem =
      this._operationInfo[0] === "old" ? item : +this._operationInfo[0];
    const secondItem =
      this._operationInfo[2] === "old" ? item : +this._operationInfo[2];
    return correctOperation(firstItem, secondItem);
  }
  getBored(item) {
    return Math.floor(item / 3);
  }
  worryTooBig(item, safeDivision) {
    return item % safeDivision;
  }
  chooseMonkey(item) {
    const testPass = item % this._test.condition === 0;
    return testPass ? this._test.monkeyIfTrue : this._test.monkeyIfFalse;
  }
  throw(item, to) {
    return { item, to };
  }
  inspect(safeDivision) {
    this.inspectionCount++;
    let item = this.items.shift();
    item = this.performOperation(item);
    if (!safeDivision) item = this.getBored(item);
    if (safeDivision) item = this.worryTooBig(item, safeDivision);
    const to = this.chooseMonkey(item);
    return this.throw(item, to);
  }
  recieve(item) {
    this.items.push(item);
  }
}

const parse = (input) => {
    return input.split(/\n\n/).map((monkey) => {
      const data = monkey.split(/\n/).splice(1);
      return {
        startingItems: data[0]
          .slice(18)
          .split(", ")
          .map((item) => +item),
        operation: data[1].slice(19).split(" "),
        test: {
          condition: +data[2].slice(20),
          monkeyIfTrue: +data[3].slice(28),
          monkeyIfFalse: +data[4].slice(30),
        },
      };
    });
  };

const day10 = (input, rounds = 1, worry) => {
  const data = parse(input);
  const Monkeys = Array(data.length)
    .fill()
    .map((_, i) => new Monkey(data[i]));
  const safeDivision = worry
    ? false
    : Monkeys.reduce((a, Mon) => a * Mon._test.condition, 1);
  for (let i = 0; i < rounds; ++i) {
    Monkeys.forEach((Monkey) => {
      [...Monkey.items].forEach((_) => {
        const { ...info } = Monkey.inspect(safeDivision);
        Monkeys[info.to].recieve(info.item);
      });
    });
  }
  return [...Monkeys]
    .map((Monkey) => Monkey.inspectionCount)
    .sort((a, b) => b - a)
    .splice(0, 2)
    .reduce((a, b) => a * b, 1);
};

console.log(`Part 1: ${day10(input, 20, true)}`);
console.log(`Part 1: ${day10(input, 10000, false)}`);