import fs from "fs";

const input = fs
  .readFileSync("./resources/day17.input.txt", "utf-8")
  .split("")
  .map((dir) => (dir === ">" ? "right" : "left"));

const test = `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`
  .split("")
  .map((dir) => (dir === ">" ? "right" : "left"));

const rocks = `####

.#.
###
.#.

..#
..#
###

#
#
#
#

##
##`
  .split(/\n\n/)
  .map((rock) =>
    rock.split(/\n/).map((row, y) =>
      row
        .split("")
        .map((col, x) => (col === "#" ? { x, y } : undefined))
        .filter((val) => val)
    )
  );

class Rock {
  constructor(shape) {
    this.shape = shape;
    this.referencePoint = this.shape[shape.length - 1][0];
    this.coords = undefined;
    this.stuck = false;
  }
  setCoords({ x, y }) {
    // x: the x val for rock's left most value to be on
    // y: the y val for rocks's bottom value to be on
    this.coords = [...this.shape].reverse().map((row, yI, arr) =>
      row.map((col) => {
        return { x: x + col.x, y: y + yI, type: "rock" };
      })
    );
  }
  returnCoords({ x, y }) {
    return [...this.shape].reverse().map((row, yI, arr) =>
      row.map((col) => {
        return { x: x + col.x, y: y + yI, type: "rock" };
      })
    );
  }
  getReferencePoint(coords) {
    const leftMostXVal = coords
      .map((row) => row[0])
      .sort((a, b) => a.x - b.x)[0].x;
    const bottomYVal = coords[0][0].y;
    return { x: leftMostXVal, y: bottomYVal };
  }
  predictMove(direction) {
    const leftMostXVal = [...this.coords]
      .map((row) => row[0])
      .sort((a, b) => a.x - b.x)[0].x;
    const bottomYVal = this.coords[0][0].y;
    if (direction === "down")
      return this.returnCoords({ x: leftMostXVal, y: bottomYVal - 1 });
    if (direction === "left")
      return this.returnCoords({ x: leftMostXVal - 1, y: bottomYVal });
    if (direction === "right")
      return this.returnCoords({ x: leftMostXVal + 1, y: bottomYVal });
  }
  move(direction) {
    const leftMostXVal = [...this.coords]
      .map((row) => row[0])
      .sort((a, b) => a.x - b.x)[0].x;
    const bottomYVal = this.coords[0][0].y;
    if (direction === "down")
      this.setCoords({ x: leftMostXVal, y: bottomYVal - 1 });
    if (direction === "left")
      this.setCoords({ x: leftMostXVal - 1, y: bottomYVal });
    if (direction === "right")
      this.setCoords({ x: leftMostXVal + 1, y: bottomYVal });
  }
}

class Chamber {
  constructor({ jetPattern, width, fallingPosition, rocks, Rock }) {
    this.Rock = Rock;
    const { left, bottom } = fallingPosition;
    this.fallingPosition = {
      left,
      bottom,
      minimumSafeDistance:
        bottom + [...rocks].sort((a, b) => b.length - a.length)[0].length,
    };
    this.rocks = rocks;
    this.jetPattern = jetPattern;
    this.counter = { rock: 0, jet: 0 };
    // map[x][y]
    this.map = Array(width)
      .fill()
      .map((_, x) =>
        Array(this.fallingPosition.minimumSafeDistance + 1)
          .fill()
          .map((_, y) => {
            return {
              x,
              y,
              type: y === 0 ? "floor" : "free",
            };
          })
      );
  }
  currentRock() {
    return this.rocks[this.counter.rock % this.rocks.length];
  }
  currentJetStream() {
    return this.jetPattern[this.counter.jet % this.jetPattern.length];
  }
  isMovementInvalid(coords) {
    return coords.some((row) =>
      row.some((coord) => {
        const { x: rockX, y: rockY } = coord;
        if (rockX >= this.map.length || rockX < 0) return true;
        if (rockY < 0) return true;

        return this.map.some((col) =>
          col.some((mapCoord) => {
            const { x: mapX, y: mapY, type } = mapCoord;
            if (mapX === rockX && mapY === rockY) {
              if (type === "free") return false;
              return true;
            }
            return false;
          })
        );
      })
    );
  }
  dropRock() {
    const Rock = new this.Rock(this.currentRock());
    const startingPos = {
      x: this.fallingPosition.left,
      y: this.firstFreeLevel() + this.fallingPosition.bottom,
    };
    Rock.setCoords(startingPos);
    const chamberLength = this.map[0].length - 1;
    for (let i = 0; i < chamberLength; i++) {
      const jet = this.currentJetStream();
      this.counter.jet = this.counter.jet + 1;
      const predictedJet = Rock.predictMove(jet);
      const jetInvalid = this.isMovementInvalid(predictedJet);
      if (jetInvalid === false)
        Rock.setCoords(Rock.getReferencePoint(predictedJet));
      const predictedDrop = Rock.predictMove("down");
      const dropInvalid = this.isMovementInvalid(predictedDrop);
      if (dropInvalid) {
        this.addRock(Rock.coords);
        this.counter.rock = this.counter.rock + 1;
        this.ensureSafeVerticalDistance();
        // this.visualise();
        return "Rock added!";
      } else {
        Rock.setCoords(Rock.getReferencePoint(predictedDrop));
      }
    }
  }
  dropRocks(number) {
    for (let i = 0; i < number; i++) {
      this.dropRock();
    }
  }
  addRock(coords) {
    coords.forEach((row) => {
      row.forEach((coord) => {
        const { x, y } = coord;
        this.map[x][y] = { ...coord, type: "rock" };
      });
    });
  }
  firstFreeLevel() {
    for (let i = 0; i < this.map[0].length; i++) {
      const entireRowFree = [...this.map].map((col) => col[i].type);
      if (entireRowFree.every((col) => col === "free")) return i;
    }
    return this.map.length - 1;
  }
  ensureSafeVerticalDistance() {
    const neededHeight =
      this.firstFreeLevel() + this.fallingPosition.minimumSafeDistance;
    const currentlyUnsafe = this.map[0].length < neededHeight;
    if (currentlyUnsafe) {
      this.map = [...this.map].map((col, x) =>
        col.concat(
          Array(this.fallingPosition.minimumSafeDistance)
            .fill()
            .map((_, yI, arr) => {
              return { x, y: arr.length + yI, type: "free" };
            })
        )
      );
      return "Adjusted!";
    } else {
      return "Not currently unsafe!";
    }
  }
  visualise() {
    const mapCopy = [...this.map];
    console.table(
      Array(mapCopy[0].length)
        .fill()
        .map((_, i) => mapCopy.map((row) => row[i]))
        .filter((row) => !row.every((item) => item === undefined))
        .map((row) =>
          row.map((item) => {
            if (item.type === "free") return ".";
            if (item.type === "floor") return "-";
            if (item.type === "rock") return "#";
          })
        )
        .reverse()
        .map((row, i, arr) => [arr.length - i - 1].concat(row).join(""))
    );
  }
}

const day17 = (part) => {
  const settings = {
    jetPattern: input,
    width: 7,
    fallingPosition: { left: 2, bottom: 3 },
    rocks,
    Rock,
  };

  const Shaft = new Chamber(settings);
  Shaft.dropRocks(part === 1 ? 2022 : 1000000000000);
  return Shaft.firstFreeLevel() - 1;
};

console.log(day17());
