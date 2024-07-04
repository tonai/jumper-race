import { GameStateWithPersisted } from "dusk-games-sdk";
import classNames from "classnames";

import { GameState, Persisted } from "../../logic/types";
import { formatTime } from "../../helpers/format";
import { levels } from "../../constants/levels";
import { colors } from "../../constants/config";

import "./styles.css";
import { RefObject, useEffect } from "react";
import { playSound } from "../../helpers/sounds";

interface IPlayersProps {
  game: GameStateWithPersisted<GameState, Persisted>;
  volume: RefObject<number>;
  yourPlayerId: string;
}

export default function Players(props: IPlayersProps) {
  const { game, volume, yourPlayerId } = props;
  const { levelIndex, playerIds, scores } = game;
  const level = levels[levelIndex];
  const [color] = colors[game.persisted[yourPlayerId].color ?? 0];

  const best = Object.values(scores ?? {}).reduce((acc, score) => {
    const bestTime = score[level.id].bestTime ?? Infinity;
    return acc < bestTime ? acc : bestTime;
  }, Infinity);
  const playerBest = scores?.[yourPlayerId][level.id].bestTime;

  useEffect(() => {
    if (playerBest !== best && best !== Infinity) {
      playSound('crown', volume.current);
    }
  }, [best, playerBest, volume]);

  return (
    <div
      className="players"
      style={{ fontSize: `${3 - 0.2 * playerIds.length}vw` }}
    >
      <ul className="players__list">
        {playerIds.map((playerId) => {
          const player = Dusk.getPlayerInfo(playerId);
          const score = scores?.[playerId][level.id];
          const playerBest = score && score.bestTime;

          return (
            <li
              key={playerId}
              className={classNames("players__player", {
                "players__player--you": player.playerId === yourPlayerId,
                "players__player--best": best === playerBest,
              })}
            >
              <div className="players__avatar">
                <img
                  className="players__image"
                  src={player.avatarUrl}
                  style={
                    playerId === yourPlayerId ? { borderColor: color } : {}
                  }
                />
              </div>
              <div>
                <div
                  className="players__name"
                  style={playerId === yourPlayerId ? { color } : {}}
                >
                  {player.displayName}{" "}
                  {player.playerId === yourPlayerId && "(you)"}
                </div>
                {level && level.id && (
                  <div className="players__time">
                    race best: {playerBest ? formatTime(playerBest) : "-"}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
