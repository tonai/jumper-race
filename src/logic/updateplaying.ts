import { levels } from "./config.ts";
import { GameState } from "./types.ts";

export function updatePlaying(game: GameState) {
  const level = levels[game.levelIndex];
  const timePassed = (Rune.gameTime() - game.timerStartedAt) / 1000;

  if (timePassed > level.totalTime) {
    game.stage = "endOfRound";
    if (game.scores) {
      const scores = Object.values(game.scores).sort((a, b) => {
        const scoreA = a[level.id];
        const scoreB = b[level.id];
        return (scoreA?.bestTime ?? Infinity) - (scoreB?.bestTime ?? Infinity);
      });
      const times = [
        ...new Set(scores.map((score) => score[level.id].bestTime)),
      ];
      scores.forEach((score) => {
        const i = times.indexOf(score[level.id].bestTime);
        score[level.id].rank = i + 1;
        score[level.id].points = scores.length - i;
      });
    }
  } else {
    game.timer = Math.floor(timePassed);
  }
}
