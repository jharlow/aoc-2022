import fs from "fs";

const input = fs.readFileSync("./resources/day18.input.txt", "utf-8");

const test = `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`;

const simpleTest = `1,1,1
2,1,1`;

class Unit {
  constructor({ x, y, z }, meta) {
    this.loc = { x, y, z };
    if (!meta) {
      this.surfaces = {
        x: { pos: "uncovered", neg: "uncovered" },
        y: { pos: "uncovered", neg: "uncovered" },
        z: { pos: "uncovered", neg: "uncovered" },
      };
    } else {
      this.surfaces = {
        x: {
          pos: x + 1 > meta.x.highest ? "exterior" : "uncovered",
          neg: x - 1 < meta.x.lowest ? "exterior" : "uncovered",
        },
        y: {
          pos: y + 1 > meta.y.highest ? "exterior" : "uncovered",
          neg: y - 1 < meta.y.lowest ? "exterior" : "uncovered",
        },
        z: {
          pos: z + 1 > meta.z.highest ? "exterior" : "uncovered",
          neg: z - 1 < meta.z.lowest ? "exterior" : "uncovered",
        },
      };
    }
  }
  updateSurfaces({ x, y, z }) {
    const { x: compareX, y: compareY, z: compareZ } = { x, y, z };
    const totalDiff =
      Math.abs(this.loc.x - compareX) +
      Math.abs(this.loc.y - compareY) +
      Math.abs(this.loc.z - compareZ);
    if (totalDiff === 0) return new Error("Passed unit in same position!");
    if (totalDiff >= 2) return "This unit does not cover any surfaces";
    const xDiff = compareX - this.loc.x;
    const yDiff = compareY - this.loc.y;
    const zDiff = compareZ - this.loc.z;
    if (xDiff) {
      xDiff > 0
        ? (this.surfaces.x.pos = "covered")
        : (this.surfaces.x.neg = "covered");
    }
    if (yDiff) {
      yDiff > 0
        ? (this.surfaces.y.pos = "covered")
        : (this.surfaces.y.neg = "covered");
    }
    if (zDiff) {
      zDiff > 0
        ? (this.surfaces.z.pos = "covered")
        : (this.surfaces.z.neg = "covered");
    }
  }
  countUncoveredSurfaces() {
    return Object.values({ ...this.surfaces })
      .flatMap((axis) => Object.values(axis))
      .filter((val) => val === "uncovered").length;
  }
  topOrBottomOf(axis, droplet) {
    if (axis !== "x" && axis !== "y" && axis !== "z")
      return new Error("Invalid input! Axis accepts x, y, or z.");

    // intersection [0 = bottom] [arr.length-1 = top]
    const intersection = (droplet) =>
      droplet
        .filter((Unit) => {
          const { x, y, z } = Unit.loc;
          if (axis === "x") {
            if (this.loc.y === y && this.loc.z === z) return true;
            return false;
          } else if (axis === "y") {
            if (this.loc.x === x && this.loc.z === z) return true;
            return false;
          } else if (axis === "z") {
            if (this.loc.x === x && this.loc.y === y) return true;
            return false;
          }
          return false;
        })
        .sort((UnitA, UnitB) => UnitA.loc[axis] - UnitB.loc[axis]);
    const axisInt = intersection(droplet);
    if (
      axisInt[0].loc.x === this.loc.x &&
      axisInt[0].loc.y === this.loc.y &&
      axisInt[0].loc.z === this.loc.z
    ) {
      return "bottom";
    } else if (
      axisInt[axisInt.length - 1].loc.x === this.loc.x &&
      axisInt[axisInt.length - 1].loc.y === this.loc.y &&
      axisInt[axisInt.length - 1].loc.z === this.loc.z
    ) {
      return "top";
    } else {
      return false;
    }
  }
}

class Droplet {
  constructor(units, Unit) {
    this.units = units.map(({ x, y, z }) => new Unit({ x, y, z }));
    this.units.forEach((Unit, _, arr) => {
      arr.forEach((OtherUnit) => {
        Unit.updateSurfaces(OtherUnit.loc);
      });
    });
    this.generateMeta();
    this.exteriorUnits = [];
  }
  totalUncoveredSurfaces() {
    return [...this.units]
      .map((Unit) => Unit.countUncoveredSurfaces())
      .reduce((a, b) => a + b, 0);
  }
  generateMeta() {
    const meta = {
      x: {
        highest: this.units.sort((UnitA, UnitB) => UnitB.loc.x - UnitA.loc.x)[0]
          .loc.x,
        lowest: this.units.sort((UnitA, UnitB) => UnitA.loc.x - UnitB.loc.x)[0]
          .loc.x,
      },
      y: {
        highest: this.units.sort((UnitA, UnitB) => UnitB.loc.y - UnitA.loc.y)[0]
          .loc.y,
        lowest: this.units.sort((UnitA, UnitB) => UnitA.loc.y - UnitB.loc.y)[0]
          .loc.y,
      },
      z: {
        highest: this.units.sort((UnitA, UnitB) => UnitB.loc.z - UnitA.loc.z)[0]
          .loc.z,
        lowest: this.units.sort((UnitA, UnitB) => UnitA.loc.z - UnitB.loc.z)[0]
          .loc.z,
      },
    };

    const area = {
      x: meta.x.highest - meta.x.lowest + 1,
      y: meta.y.highest - meta.y.lowest + 1,
      z: meta.z.highest - meta.z.lowest + 1,
    };

    this.meta = meta;
    this.area = area;
    return "Complete!";
  }
  raycast({ axis, dir }) {
    const gridAxis = ["x", "y", "z"].filter((opt) => opt !== axis);

    const grid = Array(this.area[gridAxis[0]])
      .fill()
      .flatMap((_, a) =>
        Array(this.area[gridAxis[1]])
          .fill()
          .map((_, b) => {
            return {
              [gridAxis[0]]: Number(this.meta[gridAxis[0]].lowest) + a,
              [gridAxis[1]]: Number(this.meta[gridAxis[1]].lowest) + b,
            };
          })
      );
    grid.forEach((gridItem) => {
      for (let i = 0; i < this.area[axis]; i++) {
        const axisVal =
          dir === "down"
            ? Number(this.meta[axis].lowest) + i
            : Number(this.meta[axis].highest) - i;
        const position = {
          ...gridItem,
          [axis]: axisVal,
        };

        const matchingUnit = this.units.find((Unit) => {
          const { x: oX, y: oY, z: oZ } = Unit.loc;
          const { x, y, z } = position;
          if (
            Number(oX) == Number(x) &&
            Number(oY) == Number(y) &&
            Number(oZ) === Number(z)
          )
            return true;
          return false;
        });

        if (matchingUnit) {
          this.exteriorUnits.push(matchingUnit);
        }
      }
    });
  }
  rayCastAllDirections() {
    this.raycast({ dir: "down", axis: "x" });
    this.raycast({ dir: "up", axis: "x" });
    this.raycast({ dir: "down", axis: "y" });
    this.raycast({ dir: "up", ayis: "y" });
    this.raycast({ dir: "down", axis: "z" });
    this.raycast({ dir: "up", axis: "z" });
  }
  totalUncoveredExteriorSurfaces() {
    const ExteriorUnits = new Set();
    this.exteriorUnits.forEach((Unit) => ExteriorUnits.add(Unit));
    return [...ExteriorUnits]
      .map((Unit) => Unit.countUncoveredSurfaces())
      .reduce((a, b) => a + b, 0);
  }
}

const parse = (input) =>
  input.split(/\n/).map((line) => {
    const [x, y, z] = line.split(",");
    return { x, y, z };
  });

const day18 = (input, part) => {
  const data = parse(input);
  const LavaDrop = new Droplet(data, Unit);
  if (part === 1) {
    return LavaDrop.totalUncoveredSurfaces();
  } else if (part === 2) {
    // console.log(LavaDrop.inverted.map(Unit => Unit.surfaces))
    console.log(LavaDrop.meta);
    LavaDrop.rayCastAllDirections();
    console.log(LavaDrop.totalUncoveredExteriorSurfaces());
    console.log(LavaDrop.totalUncoveredSurfaces());
    return "End of part 2";
  }
};

console.log(`Part 1: ${day18(input, 1)}`);
console.log(day18(test, 2));
