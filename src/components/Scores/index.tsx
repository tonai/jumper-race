import classNames from "classnames";
import { useEffect, useMemo, useRef, useState } from "react";

import { formatTime } from "../../helpers/format";
import { GameState } from "../../logic/types";

import "./styles.css";
import { levels } from "../../logic/config";

interface IScores {
  game: GameState;
  yourPlayerId: string;
}

export default function Scores(props: IScores) {
  const { game, yourPlayerId } = props;
  const { levelIndex, playerIds, scores } = game;
  const level = levels[levelIndex];
  const ref = useRef<HTMLUListElement>(null);
  const totals = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(scores ?? {}).map(([playerId, score]) => [
          playerId,
          Object.entries(score)
            .filter(([id]) => Number(id) !== level.id)
            .reduce((acc, [, score]) => acc + (score.points ?? 0), 0),
        ]),
      ),
    [level.id, scores],
  );
  const players = useMemo(
    () =>
      playerIds.slice().sort((a, b) => {
        const totalA = totals?.[a];
        const totalB = totals?.[b];
        return (totalB ?? 0) - (totalA ?? 0);
      }),
    [playerIds, totals],
  );
  const [finalTotals, setFinalTotal] = useState<string[] | null>(null);
  const sortedTotals = useMemo(
    () => [
      ...new Set(
        Object.entries(totals)
          .map(
            ([playerId, total]) =>
              total +
              (finalTotals ? scores?.[playerId][level.id].points ?? 0 : 0),
          )
          .sort((a, b) => b - a),
      ),
    ],
    [finalTotals, level.id, scores, totals],
  );
  const ranks = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(totals).map(([playerId, total]) => {
          const i = sortedTotals.indexOf(
            total +
              (finalTotals ? scores?.[playerId][level.id].points ?? 0 : 0),
          );
          return [playerId, i + 1];
        }),
      ),
    [finalTotals, level.id, scores, sortedTotals, totals],
  );

  useEffect(() => {
    setTimeout(() => {
      setFinalTotal(
        playerIds.slice().sort((a, b) => {
          const totalA = totals?.[a] + (scores?.[a][level.id].points ?? 0);
          const totalB = totals?.[b] + (scores?.[b][level.id].points ?? 0);
          return (totalB ?? 0) - (totalA ?? 0);
        }),
      );
    }, 5000);
  }, [level.id, playerIds, scores, totals]);

  return (
    <div className="scores">
      <ul
        className="scores__list"
        style={{ fontSize: `${(12 - playerIds.length) / 10}em` }}
        ref={ref}
      >
        {players.map((playerId, i) => {
          const player = Rune.getPlayerInfo(playerId);
          const score = scores?.[playerId][level.id];
          const total = totals[playerId];
          const rank = ranks[playerId];

          let translate = "0px 0px";
          if (finalTotals && ref.current) {
            const index = finalTotals.indexOf(playerId);
            const prevOffset =
              (ref.current.childNodes[i] as HTMLLIElement)?.offsetTop ?? 0;
            const newOffset =
              (ref.current.childNodes[index] as HTMLLIElement)?.offsetTop ?? 0;
            translate = `0px ${newOffset - prevOffset}px`;
          }

          return (
            <li
              key={playerId}
              className={classNames("scores__player", {
                "scores__player--you": player.playerId === yourPlayerId,
              })}
              style={{ gap: `${players.length + 1}em`, translate }}
            >
              <div className="scores__rank">{rank}</div>
              <div
                className="scores__avatar"
                style={{ backgroundImage: `url(${player.avatarUrl})` }}
              />
              <div className="scores__data">
                <div className="scores__name">{player.displayName}</div>
                {level && level.id && (
                  <>
                    <div className="scores__time">
                      race best:{" "}
                      {score && score.bestTime
                        ? formatTime(score.bestTime)
                        : "dnf"}
                    </div>
                    <div className="scores__score">
                      race points: {score?.points ?? 0}
                    </div>
                  </>
                )}
              </div>
              <div className="scores__total">
                {!finalTotals && (
                  <>
                    <div className="scores__total-before">
                      {total}
                      <div className="scores__total-add">
                        +{score?.points ?? 0}
                      </div>
                    </div>
                    <div className="scores__total-after">
                      {total + (score?.points ?? 0)}
                    </div>
                  </>
                )}
                {finalTotals && total + (score?.points ?? 0)}
              </div>
            </li>
          );
        })}
      </ul>
      {levelIndex < levels.length - 1 && (
        <button
          className="scores__button"
          onClick={() => Rune.actions.nextRound()}
        >
          <div className="scores__arrow" />
        </button>
      )}
    </div>
  );
}
