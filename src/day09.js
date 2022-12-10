import fs from "fs";

const input = fs.readFileSync("./resources/day09.input.txt", "utf-8");

const parse = (data) => data.split(/\n/).map((line) => line.split(" "));

class Knot {
  constructor() {
    this.position = { x: 0, y: 0 };
    this.history = [{ ...this.position }];
  }
  move({ x, y }) {
    this.position.x += x;
    this.position.y += y;
    this.history.push({ ...this.position });
  }
  moveTo(direction) {
    if (direction === "L") this.move({ x: -1, y: 0 });
    if (direction === "R") this.move({ x: +1, y: 0 });
    if (direction === "U") this.move({ x: 0, y: 1 });
    if (direction === "D") this.move({ x: 0, y: -1 });
  }
  follow(leadingPosition) {
    const { x: leadX, y: leadY } = leadingPosition;
    const { x: thisX, y: thisY } = this.position;
    const diffX = leadX - thisX
    const diffY = leadY - thisY
    if (Math.abs(diffX) > 1 || Math.abs(diffY) > 1) {
      this.move({ x: Math.sign(diffX), y: Math.sign(diffY) });
    }
  }
}

class Rope {
  constructor(length) {
    this.rope = [...new Array(length + 1)].map((_) => new Knot());
  }
  moveTo(dir) {
    this.rope[0].moveTo(dir);
    for (let i = 1; i < this.rope.length; i++) {
      const thisKnot = this.rope[i];
      const lastKnot = this.rope[i - 1];
      thisKnot.follow({ ...lastKnot.position });
    }
  }
  get headKnot() {
    return this.rope[0];
  }
  get tailKnot() {
    return this.rope[this.rope.length - 1];
  }
  get uniqueTailKnotPositions() {
    return new Set(this.tailKnot.history.map((step) => `x${step.x}y${step.y}`));
  }
}

const day09 = (input, ropeLength) => {
  const BridgeRope = new Rope(ropeLength);
  parse(input).forEach(([direction, steps]) => {
    for (let i = 0; i < steps; i++) {
      BridgeRope.moveTo(direction);
    }
  });
  return BridgeRope.uniqueTailKnotPositions.size;
};

console.info(`Part 1: ${day09(input, 1)}`);
console.info(`Part 2: ${day09(input, 9)}`);