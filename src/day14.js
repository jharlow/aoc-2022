import fs from "fs";

const input = fs.readFileSync("./resources/day14.input.txt", "utf-8");

const parse = (input) =>
  input
    .split(/\n/)
    .map((line) =>
      line.split(" -> ").map((coord) => coord.split(",").map((val) => +val))
    );

class Map {
  constructor(paths, sandPoint, floorIsLava) {
    this.paths = paths;
    this.sandPoint = sandPoint;
    const xVals = [...paths]
      .flatMap((path) => path.map((coord) => coord[0]))
      .sort((a, b) => a - b);
    const yVals = [...paths]
      .flatMap((path) => path.map((coord) => coord[1]))
      .sort((a, b) => a - b);
    this.bounds = {
      highestX: xVals[xVals.length - 1],
      lowestX: xVals[0],
      highestY: yVals[yVals.length - 1],
      lowestY: yVals[0] < this.sandPoint[1] ? yVals[0] : this.sandPoint[1],
    };
    if (floorIsLava) {
      this.bounds.highestX = this.bounds.highestX + floorIsLava;
      this.bounds.lowestX = this.bounds.lowestX - floorIsLava;
    }
    this.table = {
      height: this.bounds.highestY - this.sandPoint[1] + 1,
      width: this.bounds.highestX - this.bounds.lowestX + 1,
    };

    if (floorIsLava) {
      this.table.height = this.table.height + 2;
    }

    //array[x][y]
    this.map = Array(this.table.width)
      .fill()
      .map((_) =>
        Array(this.table.height)
          .fill()
          .map((_, i) =>
            floorIsLava && i === this.table.height - 1 ? "#" : "."
          )
      );

    this.paths.forEach((path) => {
      this.addPathToMap(path);
    });
    this.addToMap(this.sandPoint[0], this.sandPoint[1], "+");
  }
  addPathToMap(path) {
    const lowestVal = (vals, axis) =>
      vals[0][axis] < vals[1][axis] ? vals[0][axis] : vals[1][axis];

    path.forEach((coord, i, arr) => {
      const next = arr[i + 1];
      if (next === undefined) return;
      const xSame = coord[0] === next[0];
      const length =
        Math.abs(xSame ? coord[1] - next[1] : coord[0] - next[0]) + 1;
      const lowest = xSame
        ? lowestVal([coord, next], 1)
        : lowestVal([coord, next], 0);
      Array(length)
        .fill()
        .map((_, i) => [
          xSame ? coord[0] : lowest + i,
          xSame ? lowest + i : coord[1],
        ])
        .forEach((coord) => {
          const [x, y] = coord;
          this.addToMap(x, y, "#");
        });
    });
  }
  dropGrainOfSand({ x, y }) {
    const directlyDown = this.getMapVal(x, y + 1);
    if (directlyDown === ".") {
      const result = this.dropGrainOfSand({ x, y: y + 1 });
      if (result === "complete") return "complete";
      return;
    }
    const diagonallyLeft = this.getMapVal(x - 1, y + 1);
    if (diagonallyLeft === ".") {
      const result = this.dropGrainOfSand({ x: x - 1, y: y + 1 });
      if (result === "complete") return "complete";
      return;
    }
    const diagonallyRight = this.getMapVal(x + 1, y + 1);
    if (diagonallyRight === ".") {
      const result = this.dropGrainOfSand({ x: x + 1, y: y + 1 });
      if (result === "complete") return "complete";
      return;
    }
    if (
      x === this.sandPoint[0] &&
      y === this.sandPoint[1] &&
      directlyDown === "o" &&
      diagonallyLeft === "o" &&
      diagonallyRight === "o"
    ) {
      return "filled";
    }
    if (
      directlyDown === undefined ||
      diagonallyLeft === undefined ||
      diagonallyRight === undefined
    ) {
      return "complete";
    } else {
      this.addToMap(x, y, "o");
    }
  }
  dropSand(quantity) {
    for (let i = 0; i < quantity; i++) {
      const result = this.dropGrainOfSand({
        x: this.sandPoint[0],
        y: this.sandPoint[1],
      });
      if (result === "complete") {
        return `Dropped ${i} units of sand`;
      }
      if (result === "filled") {
        return `Dropped ${i + 1} units of sand`;
      }
    }
  }
  addToMap(x, y, val) {
    this.map[x - this.bounds.lowestX][y - this.bounds.lowestY] = val;
  }
  getMapVal(x, y) {
    if (
      x - this.bounds.lowestX < 0 ||
      x - this.bounds.lowestX >= this.table.width
    )
      return undefined;
    return this.map[x - this.bounds.lowestX][y - this.bounds.lowestY];
  }
  visualise() {
    console.table(
      [...this.map]
        .map((_, i) => this.map.map((row) => row[i]).join(""))
        .slice(0, this.table.height)
    );
  }
}

const day14 = (part) => {
  const data = parse(input);
  const sandPoint = [500, 0];

  if (part === 1) {
    const CaveMap = new Map(data, sandPoint);
    CaveMap.visualise();
    console.log(`Part 1: ${CaveMap.dropSand(10000)}`);
    CaveMap.visualise();
  }
  if (part === 2) {
    const CaveMap = new Map(data, sandPoint, 4000);
    console.log(`Part 2: ${CaveMap.dropSand(100000)}`);
  }
};

day14(1);
day14(2);
