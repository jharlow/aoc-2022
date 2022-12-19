import fs from "fs";

const input = fs.readFileSync("./resources/day15.input.txt", "utf-8");

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
    this.area.width = this.area.right - this.area.left;
    this.area.height = this.area.bottom - this.area.top;
  }
  getRow({ y }) {
    const yDiff = Math.abs(this.position.y - y);
    const xDiff = this.manhattanRange - yDiff;
    return {
      start: { x: this.position.x - xDiff, y },
      end: { x: this.position.x + xDiff, y },
      sensor: this.position.y === y ? this.position : undefined,
      beacon: this.beacon.y === y ? this.beacon : undefined,
    };
  }
}

const day15 = (part) => {
  const data = parse(test);
  if (part === 1) {
    const row = 2000000;
    const coords = data
      .flatMap((line) => {
        const [position, beacon] = line;
        return new Sensor(position, beacon).getRow({ y: row });
      })
      .filter((v) => v);

    const meta = {
      sensors: coords.map((val) => val.sensor).filter((v) => v),
      beacons: coords.map((val) => val.beacon).filter((v) => v),
      rows: coords.map((val) => [val.start.x, val.end.x]),
      lowest: coords
        .flatMap((v) => [v.start.x, v.end.x])
        .sort((a, b) => a - b)[0],
      highest: coords
        .flatMap((v) => [v.start.x, v.end.x])
        .sort((a, b) => b - a)[0],
    };

    return meta.highest - meta.lowest;
  }

  if (part === 2) {
    const Sensors = data.map(
      ([position, beacon]) => new Sensor(position, beacon)
    );
    const constraints = {
      x: { lowest: 0, highest: 20 },
      y: { lowest: 0, highest: 20 },
    };

    for (let y = constraints.y.lowest; y <= constraints.y.highest; y++) {
      console.log(
        `${y} of ${constraints.y.highest}: ${
          Math.ceil((y / constraints.y.highest) * 100)
        }%`
      );

      const coords = Sensors.map((Sensor) => Sensor.getRow({ y }));

      const meta = {
        sensors: coords.map((val) => val.sensor).filter((v) => v),
        beacons: coords.map((val) => val.beacon).filter((v) => v),
        rows: coords.map((val) => [val.start.x, val.end.x]),
        lowest: coords
          .flatMap((v) => [v.start.x, v.end.x])
          .sort((a, b) => a - b)[0],
        highest: coords
          .flatMap((v) => [v.start.x, v.end.x])
          .sort((a, b) => b - a)[0],
      };

      const between = (x, min, max) => x > min && x < max ;
      const noGaps = meta.rows
        .map(([start, end]) => [
          start < end ? start : end,
          start > end ? start : end,
        ])
        .sort(([start, end], [nextS, nextE]) => start - nextS)
        // .every(([s, e], i, arr) => {
        //   if (s === meta.lowest)
        //     return arr.some(([oS, oE], oI) => {
        //       if (i === oI) return false;
        //       return between(e-1, oS, oE) && between(e+1, oS, oE);
        //     });
        //   if (e === meta.highest)
        //     return arr.some(([oS, oE], oI) => {
        //       if (i === oI) return false;
        //       return between(s-1, oS, oE) && between(s+1, oS, oE);
        //     });
        //   return (
        //     arr.some(([oS, oE], oI) => {
        //       if (i === oI) return false;
        //       return between(s-1, oS, oE) && between(s+1, oS, oE);
        //     }) &&
        //     arr.some(([oS, oE], oI) => {
        //       if (i === oI) return false;
        //       return between(e-1, oS, oE) && between(e+1, oS, oE);
        //     })
        //   );
        // });
      
      console.log(noGaps)
      
      if (true) {
        const beaconXIndex = Array(meta.highest - meta.lowest)
          .fill()
          .map((_, i) => {
            const xPos = meta.lowest + i;
            if (xPos < constraints.x.lowest || xPos > constraints.x.highest)
              return undefined;
            if (meta.sensors.some((sensor) => sensor.x === xPos)) return "S";
            if (meta.beacons.some((beacon) => beacon.x === xPos)) return "B";
            if (meta.rows.some(([start, end]) => xPos >= start && xPos <= end))
              return "#";
            else return ".";
          })
          .findIndex((val) => val === ".");

        const beacon =
          beaconXIndex === -1
            ? undefined
            : { x: meta.lowest + beaconXIndex, y };

        if (beacon) {
          const tuningFreq = beacon.x * 4000000 + y;
          return tuningFreq;
        }
      }
    }
  }
};

console.log(day15(2));

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
