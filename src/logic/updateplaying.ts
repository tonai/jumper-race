import { GameState } from "./types.ts";

export function updatePlaying(game: GameState) {
  const timePassed = (Rune.gameTime() - game.timerStartedAt) / 1000;

  if (timePassed > game.level.totalTime) {
    game.stage = "endOfRound";
    if (game.scores) {
      const scores = Object.values(game.scores).sort((a, b) => {
        const scoreA = a[game.level.id];
        const scoreB = b[game.level.id];
        return (scoreA?.bestTime ?? Infinity) - (scoreB?.bestTime ?? Infinity);
      });
      const times = [...new Set(scores.map(score => score[game.level.id].bestTime))];
      scores.forEach((score) => {
        const i = times.indexOf(score[game.level.id].bestTime);
        score[game.level.id].rank = i + 1;
        score[game.level.id].points = scores.length - i;
      });
    }
  } else {
    game.timer = Math.floor(timePassed);
  }
}
