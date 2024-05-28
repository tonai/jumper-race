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

  return (
    <div
      className="players"
      style={{ fontSize: `${3 - 0.2 * playerIds.length}vw` }}
    >
      <ul className="players__list">
        {playerIds.map((playerId) => {
          const player = Rune.getPlayerInfo(playerId);
          const score = scores?.[playerId][level.id];

          return (
            <li
              key={playerId}
              className={classNames("players__player", {
                "players__player--you": player.playerId === yourPlayerId,
              })}
            >
              <img className="players__avatar" src={player.avatarUrl} />
              <div>
                <div>{player.displayName}</div>
                {level && level.id && (
                  <div className="players__time">
                    race best:{" "}
                    {score && score.bestTime ? formatTime(score.bestTime) : "-"}
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
