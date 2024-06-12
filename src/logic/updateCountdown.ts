import { startCountdownDurationSeconds } from "../constants/config.ts";
import { GameState } from "./types.ts";

export function updateCountdown(game: GameState) {
  const time = Rune.gameTime();
  const timePassed = (time - game.timerStartedAt) / 1000;

  if (timePassed > startCountdownDurationSeconds) {
    game.timerStartedAt = time;
    game.stage = "playing";
  } else {
    game.countdownTimer = Math.ceil(startCountdownDurationSeconds - timePassed);
  }
}
