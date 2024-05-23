import type { RuneClient } from "rune-games-sdk/multiplayer";

import {
  countdownDurationSeconds,
  jumpForce,
  playerHeight,
  updatesPerSecond,
} from "./config";
import { GameActions, GameState, ISendTimeData } from "./types";
import { updateCountdown } from "./updateCountdown";
import { newRound } from "./newRound";
import { updatePlaying } from "./updateplaying";

declare global {
  const Rune: RuneClient<GameState, GameActions>;
}

Rune.initLogic({
  landscape: true,
  minPlayers: 1,
  maxPlayers: 6,
  setup: (allPlayerIds) => ({
    countdownTimer: countdownDurationSeconds,
    level: {
      id: 1,
      width: 1000,
      height: 200,
      start: { x: 10, y: 180 - playerHeight - jumpForce },
      blocks: [
        { x: 0, width: 1000, y: 180, height: 20 },
        { x: 500, width: 500, y: 160, height: 20 },
        { x: 600, width: 400, y: 140, height: 20 },
        { x: 700, width: 300, y: 120, height: 20 },
        { x: 750, width: 250, y: 90, height: 30 },
        { x: 800, width: 200, y: 60, height: 30 },
        { x: 850, width: 150, y: 30, height: 30 },
      ],
      end: { x: 940, y: 10, width: 20, height: 20 },
      totalTime: 3, // 60,
    },
    playerIds: allPlayerIds,
    stage: "gettingReady",
    timer: 0,
    timerStartedAt: 0,
  }),
  actions: {
    sendTime({ playerId, time }: ISendTimeData, { game }) {
      if (game.scores?.[playerId]) {
        const playerScore = game.scores[playerId][game.level.id];
        if (playerScore && playerScore.bestTime) {
          if (time < playerScore.bestTime) {
            playerScore.bestTime = time;
          }
        } else {
          game.scores[playerId][game.level.id] = {
            bestTime: time,
          };
        }
      }
    },
    setReady(_, { game }) {
      if (game.stage !== "gettingReady") throw Rune.invalidAction();
      newRound(game);
    },
  },
  update: ({ game }) => {
    if (game.stage === "countdown") updateCountdown(game);
    if (game.stage === "playing") updatePlaying(game);
  },
  updatesPerSecond,
});
