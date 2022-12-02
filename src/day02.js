import fs from "fs";

const winningMatches = {
  rock: "scissors",
  scissors: "paper",
  paper: "rock",
};

const losingMatches = {
  rock: "paper",
  scissors: "rock",
  paper: "scissors",
};

const roundScoreBasePoints = {
  rock: 1,
  paper: 2,
  scissors: 3,
};

const roundScoreAdditions = {
  lose: 0,
  draw: 3,
  win: 6,
};

const opponentSelection = {
  A: "rock",
  B: "paper",
  C: "scissors",
};

// ROUND 1: SELECTION MATCHES
// const yourSelection = {
//   X: "rock",
//   Y: "paper",
//   Z: "scissors",
// };

// ROUND 2: CONDITIONAL TO OPPONENT
const yourSelection = (opponent, you) => {
  const selections = {
    X: winningMatches[opponent],
    Y: opponent,
    Z: losingMatches[opponent],
  };
  return selections[you];
};

const inputInvalid = (i) => {
  if (i !== "rock" && i !== "paper" && i !== "scissors")
    throw new Error("Input invalid!");
};

const roundOutcome = (opponent, you) => {
  if (opponent === you) return "draw";
  if (winningMatches[opponent] === you) return "lose";
  if (winningMatches[you] === opponent) return "win";
  else return "error";
};

const roundScore = (opponent, you) => {
  if (inputInvalid(opponent) || inputInvalid(you)) return;
  const shapePoints = roundScoreBasePoints[you];
  const outcome = roundOutcome(opponent, you);
  const outcomePoints = roundScoreAdditions[outcome];
  return shapePoints + outcomePoints;
};

const day02 = () => {
  const emptyNewLineRegex = /(?:\h*\n)/;
  const answer = fs
    .readFileSync("./resources/day02.input.text", "utf-8")
    .split(emptyNewLineRegex)
    .map((round) => round.split(" "))
    .reduce((total, round) => {
      const opponent = opponentSelection[round[0]];
      // ROUND 1: MATCHING SELECTION
      // const you = yourSelection[round[1]]
      const you = yourSelection(opponent, [round[1]]);
      const score = roundScore(opponent, you);
      return total + score;
    }, 0);

  return answer;
};

console.log(day02());
