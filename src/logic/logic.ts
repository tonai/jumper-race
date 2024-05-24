import type { RuneClient } from "rune-games-sdk/multiplayer";

import {
  countdownDurationSeconds,
  jumpForce,
  playerHeight,
  updatesPerSecond,
} from "./config";
import { BlockType, GameActions, GameState, ISendTimeData } from "./types";
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
      width: 1200,
      height: 200,
      start: { x: 10, y: 180 - playerHeight - jumpForce },
      blocks: [
        { x: 0, width: 1200, y: 180, height: 20 },
        { x: 200, width: 500, y: 160, height: 20 },
        { x: 300, width: 400, y: 140, height: 20 },
        { x: 400, width: 300, y: 120, height: 20 },
        { x: 450, width: 250, y: 90, height: 30 },
        { x: 500, width: 200, y: 60, height: 30 },
        { x: 550, width: 250, y: 30, height: 30 },
        { x: 900, width: 50, y: 0, height: 150 },
        { x: 800, width: 100, y: 90, height: 30 },
        { x: 1000, width: 200, y: 30, height: 150 },
        { x: 650, width: 50, y: 20, height: 10, type: BlockType.Spikes },
        { x: 899, width: 1, y: 60, height: 30, type: BlockType.Reverse },
        { x: 700, width: 1, y: 120, height: 20, type: BlockType.Reverse },
        { x: 980, width: 20, y: 179, height: 1, type: BlockType.Jump, force: 12 },
        { x: 1165, y: 10, width: 20, height: 20, type: BlockType.End },
      ],
      totalTime: 60,
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
  }
});
