import classNames from "classnames";
import { GameStateWithPersisted } from "dusk-games-sdk";
import { useEffect, useMemo, useRef, useState } from "react";

import { formatTime } from "../../helpers/format";
import { GameState, Persisted } from "../../logic/types";
import { levels } from "../../constants/levels";
import { colors } from "../../constants/config";

import "./styles.css";

interface IScores {
  game: GameStateWithPersisted<GameState, Persisted>;
  yourPlayerId: string;
}

export default function Scores(props: IScores) {
  const { game, yourPlayerId } = props;
  const { levelIndex, playerIds, scores } = game;
  const level = levels[levelIndex];
  const [color] = colors[game.persisted[yourPlayerId].color ?? 0];
  const ref = useRef<HTMLUListElement>(null);
  const totals = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(scores ?? {}).map(([playerId, score]) => [
          playerId,
          Object.entries(score)
            .filter(([id]) => id !== level.id)
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

  const best = Object.values(scores ?? {}).reduce((acc, score) => {
    const bestTime = score[level.id].bestTime ?? Infinity;
    return acc < bestTime ? acc : bestTime;
  }, Infinity);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFinalTotal(
        playerIds.slice().sort((a, b) => {
          const totalA = totals?.[a] + (scores?.[a][level.id].points ?? 0);
          const totalB = totals?.[b] + (scores?.[b][level.id].points ?? 0);
          return (totalB ?? 0) - (totalA ?? 0);
        }),
      );
    }, 5000);
    return () => clearTimeout(timeout);
  }, [level.id, playerIds, scores, totals]);

  useEffect(() => {
    if (finalTotals) {
      setTimeout(() => Dusk.showGameOverPopUp(), 1000);
    }
  }, [finalTotals]);

  return (
    <div className="scores">
      <ul
        className="scores__list"
        style={{ fontSize: `${(12 - playerIds.length) / 10}em` }}
        ref={ref}
      >
        {players.map((playerId, i) => {
          const player = Dusk.getPlayerInfo(playerId);
          const score = scores?.[playerId][level.id];
          const total = totals[playerId];
          const rank = ranks[playerId];
          const playerBest = score && score.bestTime;

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
                "scores__player--best": best === playerBest,
              })}
              style={{ gap: `${Math.max(1, players.length - 1)}em`, translate }}
            >
              <div
                className={classNames("scores__rank", {
                  "scores__rank--gold": rank === 1,
                  "scores__rank--silver": rank === 2,
                  "scores__rank--bronze": rank === 3,
                })}
              >
                {rank}
              </div>
              <div
                className="scores__avatar"
                style={{
                  backgroundImage: `url(${player.avatarUrl})`,
                  borderColor: playerId === yourPlayerId ? color : undefined,
                }}
              />
              <div className="scores__data">
                <div
                  className="scores__name"
                  style={playerId === yourPlayerId ? { color } : {}}
                >
                  {player.displayName}{" "}
                  {player.playerId === yourPlayerId && "(you)"}
                </div>
                {level && level.id && (
                  <>
                    <div className="scores__time">
                      race best: {playerBest ? formatTime(playerBest) : "dnf"}
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
      {levelIndex < levels.length - 1 && game.mode === "championship" && (
        <button
          className="scores__button"
          onClick={() => Dusk.actions.nextRound()}
          type="button"
        >
          <div className="scores__arrow" />
        </button>
      )}
    </div>
  );
}
