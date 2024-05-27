import { useEffect } from "react";

import { levels } from "../../logic/config";

import Race from "../Race";

import "./styles.css";

interface IRacesProps {
  mode: string;
  playerIds: string[];
  votes: Record<string, string>;
  yourPlayerId: string;
}

export default function Races(props: IRacesProps) {
  const { mode, playerIds, yourPlayerId, votes } = props;

  useEffect(() => {
    if (mode) {
      const timeout = setTimeout(() => Rune.actions.startRace(), 2000);
      return () => clearTimeout(timeout);
    }
  }, [mode]);

  return (
    <div className="races">
      <ul className="races__list">
        <li>
          <h2 className="races__title">Select race (votes {Object.keys(votes).length}/{playerIds.length})</h2>
        </li>
        {levels.map((level) => (
          <Race
            key={level.id}
            label={`Race ${level.id}`}
            levelId={level.id}
            mode={mode}
            votes={votes}
            yourPlayerId={yourPlayerId}
          />
        ))}
        <Race
          label="Championship"
          levelId="championship"
          mode={mode}
          votes={votes}
          yourPlayerId={yourPlayerId}
        />
      </ul>
    </div>
  );
}
