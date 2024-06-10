import classNames from "classnames";

import { GameState } from "../../logic/types";

import "./styles.css";
import { formatTime } from "../../helpers/format";
import { levels } from "../../logic/config";

interface IPlayersProps {
  game: GameState;
  yourPlayerId: string;
}

export default function Players(props: IPlayersProps) {
  const { game, yourPlayerId } = props;
  const { levelIndex, playerIds, scores } = game;
  const level = levels[levelIndex];

  const best = Object.values(scores ?? {}).reduce((acc, score) => {
    const bestTime = score[level.id].bestTime ?? Infinity;
    return acc < bestTime ? acc : bestTime;
  }, Infinity);

  return (
    <div
      className="players"
      style={{ fontSize: `${3 - 0.2 * playerIds.length}vw` }}
    >
      <ul className="players__list">
        {playerIds.map((playerId) => {
          const player = Rune.getPlayerInfo(playerId);
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
                <img className="players__image" src={player.avatarUrl} />
              </div>
              <div>
                <div className="players__name">
                  {player.displayName}{" "}
                  {player.playerId === yourPlayerId && "(you)"}
                </div>
                {level && level.id && (
                  <div className="players__time">
                    race best:{" "}
                    {playerBest ? formatTime(playerBest) : "-"}
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
