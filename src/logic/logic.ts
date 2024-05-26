import type { RuneClient } from "rune-games-sdk/multiplayer";

import { countdownDurationSeconds, levels, updatesPerSecond } from "./config";
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
    level: levels[0],
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
  events: {
    playerJoined: (playerId, { game }) => {
      game.playerIds.push(playerId);
      if (game.scores) {
        game.scores[playerId] = {};
        if (game.level.id) {
          game.scores[playerId][game.level.id] = {};
        }
      }
    },
    playerLeft: (playerId, { game }) => {
      game.playerIds.splice(game.playerIds.indexOf(playerId), 1);
      if (game.scores) {
        delete game.scores[playerId];
      }
    },
  },
});
