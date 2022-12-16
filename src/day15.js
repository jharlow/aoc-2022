import fs from "fs";

const input = fs.readFileSync("./resources/day15.input.txt", "utf-8")

const test = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;

const parse = (input) => {
  return input.split(/\n/).map((line) =>
    line.split(": ").map((object, i) => {
      return {
        type: i === 0 ? "S" : "B",
        x: Number(object.split("x=")[1].split(",")[0]),
        y: Number(object.split("y=")[1]),
      };
    })
  );
};

class Sensor {
  constructor(position, beacon) {
    this.position = position;
    this.beacon = beacon;
    const { x: sensorX, y: sensorY } = position;
    const { x: beaconX, y: beaconY } = beacon;
    this.manhattanRange =
      Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY);
    this.area = {
      top: this.position.y - this.manhattanRange,
      bottom: this.position.y + this.manhattanRange,
      left: this.position.x - this.manhattanRange,
      right: this.position.x + this.manhattanRange,
    };
  }
  getValue({x, y}) {
    if (x === this.position.x && y === this.position.y) return "S"
    if (x === this.beacon.x && y === this.beacon.y) return "B"
    const xDiff = Math.abs(this.position.x, x);
    const yDiff = Math.abs(this.position.y, y);
    console.log(xDiff, yDiff)

  }
  get allCoordinates() {
    return [this.position].concat([this.beacon]).concat(this.area.coords);
  }
}



const data = parse(test);

const day15 = () => {
  const coords = data.flatMap((line) => {
    const [position, beacon] = line;
    return new Sensor(position, beacon);
  });

  coords[0].getValue({x: 2, y: 18})
};

day15();

// class Map {
//   constructor(coords) {
//     this.meta = {
//       x: {
//         highest: coords.sort((a, b) => b.x - a.x)[0].x,
//         lowest: coords.sort((a, b) => a.x - b.x)[0].x,
//       },
//       y: {
//         highest: coords.sort((a, b) => b.y - a.y)[0].y,
//         lowest: coords.sort((a, b) => a.y - b.y)[0].y,
//       },
//     };
//     this.meta.height = this.meta.y.highest - this.meta.y.lowest + 1;
//     this.meta.width = this.meta.x.highest - this.meta.x.lowest + 1;
//     this.map = Array(this.meta.width)
//       .fill()
//       .map((_, i) =>
//         Array(this.meta.height)
//           .fill()
//           .map((_) => ".")
//       );

//     coords.forEach((coord) => {
//       const curVal = this.getValueFromMap(coord);
//       if (curVal === "." || curVal === "#") this.addItemToMap(coord);
//     });
//   }
//   getValueFromMap({ x, y }) {
//     return this.map[x - this.meta.x.lowest][y - this.meta.y.lowest];
//   }
//   eliminatedBeaconPositionsRow(y) {
//     return this.getRowFromMap(y).filter(val => val === "#").length
//   }
//   getRowFromMap(y) {
//     return this.map.map(row => row[y - this.meta.y.lowest])
//   }
//   addItemToMap({ x, y, type }) {
//     this.map[x - this.meta.x.lowest][y - this.meta.y.lowest] = type;
//   }
//   visualise() {
//     console.table(
//       [...this.map]
//         .map((_, i) => this.map.map((row) => row[i]).join(""))
//         .slice(0, this.meta.height)
//     );
//   }
// }