import type { RuneClient } from "rune-games-sdk/multiplayer";

import { countdownDurationSeconds, levels, updatesPerSecond } from "./config";
import { GameActions, GameState, IVoteRaceData, ISendTimeData } from "./types";
import { updateCountdown } from "./updateCountdown";
import { newRound } from "./newRound";
import { updatePlaying } from "./updatePlaying";
import { randomInt } from "../helpers/utils";

declare global {
  const Rune: RuneClient<GameState, GameActions>;
}

Rune.initLogic({
  landscape: true,
  minPlayers: 1,
  maxPlayers: 6,
  setup: (allPlayerIds) => ({
    countdownTimer: countdownDurationSeconds,
    levelIndex: 0,
    mode: "",
    playerIds: allPlayerIds,
    stage: "gettingReady",
    raceVotes: {},
    timer: 0,
    timerStartedAt: 0,
  }),
  actions: {
    nextRound: (_, { game }) => {
      if (game.stage !== "endOfRound") throw Rune.invalidAction();
      if (game.mode === "championship") {
        game.levelIndex++;
        newRound(game);
      }
    },
    sendTime({ playerId, time }: ISendTimeData, { game }) {
      if (game.stage !== "playing") throw Rune.invalidAction();
      if (game.scores?.[playerId]) {
        const level = levels[game.levelIndex];
        const playerScore = game.scores[playerId][level.id];
        if (playerScore && playerScore.bestTime) {
          if (time < playerScore.bestTime) {
            playerScore.bestTime = time;
          }
        } else {
          game.scores[playerId][level.id] = {
            bestTime: time,
          };
        }
      }
    },
    setReady(_, { game }) {
      if (game.stage !== "gettingReady") throw Rune.invalidAction();
      // newRound(game);
      game.mode = "";
      game.raceVotes = {};
      game.stage = "raceSelect";
    },
    startRace(_, { game }) {
      if (game.stage !== "raceSelect") throw Rune.invalidAction();
      newRound(game);
    },
    voteRace({ playerId, race }: IVoteRaceData, { game }) {
      if (game.stage !== "raceSelect") throw Rune.invalidAction();
      game.raceVotes[playerId] = race;
      // Select race
      if (Object.keys(game.raceVotes).length >= game.playerIds.length) {
        const votesById = Object.values(game.raceVotes).reduce<
          Record<string, number>
        >((acc, id) => {
          if (acc[id]) {
            acc[id]++;
          } else {
            acc[id] = 1;
          }
          return acc;
        }, {});
        const maxVotes = Math.max(...Object.values(votesById));
        const maxVoteIds = Object.entries(votesById)
          .filter(([, votes]) => votes === maxVotes)
          .map(([id]) => id);
        const id =
          maxVoteIds.length === 1
            ? maxVoteIds[0]
            : maxVoteIds[randomInt(maxVoteIds.length - 1)];
        game.mode = id;
        if (id === "championship") {
          game.levelIndex = 0;
        } else {
          game.levelIndex = levels.findIndex((level) => level.id === id);
        }
      }
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
        const level = levels[game.levelIndex];
        if (level.id) {
          game.scores[playerId][level.id] = {};
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
