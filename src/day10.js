import fs from "fs";

const data = fs.readFileSync("./resources/day10.input.txt", "utf-8");

const parse = (input) => input.split(/\n/).map((line) => line.split(" "));

class CPU {
  constructor() {
    this.X = 1;
    this.cycle = 1;
    this.cycleHistory = [{ cycle: this.cycle, X: this.X }];
  }
  increaseCycle(num = 1) {
    for (let i = 0; i < num; i++) {
      this.cycleHistory.push(this.cycleLog);
      this.cycle++;
    }
  }
  changeXBy(num) {
    this.increaseCycle();
    this.increaseCycle();
    Math.sign(num) ? (this.X += num) : (this.X -= -num);
  }
  runProgram(input) {
    input.forEach(([instruction, xVal]) => {
      if (instruction === "noop") this.increaseCycle();
      if (instruction === "addx") this.changeXBy(+xVal);
    });
  }
  get cycleLog() {
    return { cycle: this.cycle, X: this.X };
  }
  logFromCycle(n) {
    return this.cycleHistory.find((log) => log.cycle === n);
  }
  signalStrengthFromCycle(n) {
    const log = this.logFromCycle(n);
    return log.cycle * log.X;
  }
  spriteVisibleCycle(n) {
    const log = this.logFromCycle(n);
    const cycle = log.cycle > 40 ? log.cycle % 40 || 40 : log.cycle;
    const pos = cycle - 1;
    const spritePositions = Array(3)
      .fill()
      .map((_, i) => {
        return log.X - (1 - i);
      });
    return spritePositions.some((i) => i === pos);
  }
}

const day10 = (part) => {
  const input = parse(data);
  const RepairedCPU = new CPU();
  RepairedCPU.runProgram(input);
  if (part === 1) {
    const signalsToCheck = [20, 60, 100, 140, 180, 220];
    return signalsToCheck
      .map((n) => RepairedCPU.signalStrengthFromCycle(n))
      .reduce((tot, curr) => tot + curr, 0);
  }
  if (part === 2) {
    return Array(6)
      .fill()
      .map((_, i) => {
        const firstCycle = 40 * i + 1;
        return Array(40)
          .fill()
          .map((_, i) => {
            const cycle = firstCycle + i;
            return RepairedCPU.spriteVisibleCycle(cycle) ? "#" : ".";
          })
          .join("");
      });
  }
};

console.info(`Part 1: ${day10(1)}`);
console.info("Part 2:");
console.info(day10(2));