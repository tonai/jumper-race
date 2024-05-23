import classNames from "classnames";

import { GameState } from "../../logic/types";

import "./styles.css";

interface IPlayersProps {
  game: GameState;
  yourPlayerId: string;
}

export default function Players(props: IPlayersProps) {
  const { game, yourPlayerId } = props;
  const { level, playerIds, scores } = game;

  return (
    <ul className="players">
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
                  {score && score.bestTime ? score.bestTime / 1000 : "-"}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
