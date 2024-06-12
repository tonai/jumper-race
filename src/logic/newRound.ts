import { startCountdownDurationSeconds } from "../constants/config.ts";
import { levels } from "../constants/levels";
import { GameState } from "./types.ts";

export function newRound(game: GameState) {
  game.stage = "countdown";
  game.countdownTimer = startCountdownDurationSeconds;
  game.timerStartedAt = Rune.gameTime();
  if (!game.scores) {
    game.scores = Object.fromEntries(
      game.playerIds.map((playerId) => [playerId, {}]),
    );
  }
  const level = levels[game.levelIndex];
  Object.values(game.scores).forEach((score) => {
    score[level.id] = {};
  });
  game.ghosts = Object.fromEntries(
    game.playerIds.map((playerId) => [
      playerId,
      { ...level.start, grounded: true, movement: { x: 0, y: 0 }, reverse: false, time: 0, z: 0 },
    ]),
  );
}
