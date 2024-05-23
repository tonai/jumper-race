import classNames from "classnames";
import { GameState } from "../../logic/types";

import "./styles.css";

interface IScores {
  game: GameState;
  yourPlayerId: string;
}

export default function Scores(props: IScores) {
  const { game, yourPlayerId } = props;
  const { level, playerIds, scores } = game;
  const players = playerIds.slice().sort((a, b) => {
    const scoreA = scores?.[a][level.id];
    const scoreB = scores?.[b][level.id];
    return (scoreA?.rank ?? Infinity) - (scoreB?.rank ?? Infinity);
  });
  const totals = Object.fromEntries(
    Object.entries(scores ?? {}).map(([playerId, score]) => [
      playerId,
      Object.entries(score)
        .filter(([level]) => Number(level) !== game.level.id)
        .reduce((acc, [, score]) => acc + (score.bestTime ?? 0), 0),
    ]),
  );

  return (
    <ul className="scores">
      {players.map((playerId) => {
        const player = Rune.getPlayerInfo(playerId);
        const score = scores?.[playerId][level.id];
        const total = totals[playerId];

        return (
          <li
            key={playerId}
            className={classNames("scores__player", {
              "scores__player--you": player.playerId === yourPlayerId,
            })}
          >
            <div className="scores__rank">{score ? score.rank : ""}</div>
            <div
              className="scores__avatar"
              style={{ backgroundImage: `url(${player.avatarUrl})` }}
            />
            <div className="scores__data">
              <div>{player.displayName}</div>
              {level && level.id && (
                <>
                  <div className="scores__time">
                    race best:{" "}
                    {score && score.bestTime ? score.bestTime / 1000 : "dnf"}
                  </div>
                  <div className="scores__score">
                    race points: {score ? score.points : "0"}
                  </div>
                </>
              )}
            </div>
            <div className="scores__total">
              <div className="scores__total-before">
                {total}
                <div className="scores__total-add">
                  +{score ? score.points : "0"}
                </div>
              </div>
              <div className="scores__total-after">
                {total + (score?.points ?? 0)}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
