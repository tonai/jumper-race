import { countdownDurationSeconds } from "./config.ts";
import { GameState } from "./types.ts";

export function newRound(game: GameState) {
  game.stage = "countdown";
  game.countdownTimer = countdownDurationSeconds;
  game.timerStartedAt = Rune.gameTime();
  if (!game.scores) {
    game.scores = Object.fromEntries(
      game.playerIds.map((playerId) => [
        playerId,
        {},
      ]),
    );
  }
  Object.values(game.scores).forEach((score) => {
    score[game.level.id] = {};
  });
}
