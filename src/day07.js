import fs from "fs";

const data = fs
  .readFileSync("./resources/day07.input.txt", "utf-8")
  .split(/\n/);

const lineType = (terminalLine) =>
  terminalLine.split("")[0] === "$" ? "command" : "information";

let directory = {};
let activePath = [];

const correctDirectory = (command) => {
  const direction = command.split(" ")[2];
  if (direction.match(/[a-z]/i)) activePath.push(direction);
  if (direction === "..") activePath.pop();
  if (direction === "/") activePath = [];
};

const createFile = (file) => {
  const fileMeta = file.split(" ");
  if (fileMeta[0] === "dir") return false;
  else return { name: fileMeta[1], size: Number(fileMeta[0]) };
};

const addToDirectory = (dir, location, addition) => {
  if (location.length > 1) {
    var e = location.shift();
    addToDirectory(
      (dir[e] =
        Object.prototype.toString.call(dir[e]) === "[object Object]"
          ? dir[e]
          : {}),
      location,
      addition
    );
  } else dir[location[0]] = addition;
};

const getSizeOfDir = (dir) => {
  return Object.values(dir).reduce(
    (count, curr) =>
      typeof curr === "number" ? count + curr : count + getSizeOfDir(curr),
    0
  );
};

const getAllDirectorySizes = (dir) => {
  const sizes = [];
  sizes.push({ name: "/", size: getSizeOfDir(dir) });
  const addDirectorySizes = (dir) =>
    Object.keys(dir)
      .filter((key) => typeof dir[key] === "object")
      .forEach((key) => {
        sizes.push({ name: key, size: getSizeOfDir(dir[key]) });
        addDirectorySizes(dir[key]);
      });
  addDirectorySizes(dir);
  return sizes;
};

const day07 = (part) => {
  data.map((line, i) => {
    const type = lineType(line);
    if (type === "command") {
      const commandType = line.split(" ")[1];
      if (commandType === "cd") correctDirectory(line);
      if (commandType === "ls") {
        const endOfFiles = data.findIndex((line, copyI) => {
          if (copyI <= i) return false;
          if (lineType(line) === "command") return true;
        });

        data
          .slice(i + 1, endOfFiles === -1 ? undefined : endOfFiles)
          .map((file) => createFile(file))
          .filter((f) => f)
          .forEach((file) =>
            addToDirectory(
              directory,
              [...activePath, file.name],
              file.size
            )
          );
      }
    }
  });
  if (part === 1) {
    return getAllDirectorySizes(directory)
      .filter((dir) => dir.size < 100000)
      .reduce((prev, curr) => prev + curr.size, 0);
  }
  if (part === 2) {
    const allDirs = getAllDirectorySizes(directory);
    const free = 70000000 - allDirs[0].size;
    const missing = 30000000 - free;
    return allDirs
      .sort((a, b) => a.size - b.size)
      .find((dir) => dir.size >= missing)
      .size;
  }
};

console.info(`Part 1: ${day07(1)}`);
console.info(`Part 2: ${day07(2)}`);