import classNames from "classnames";
import "./styles.css";

interface IRaceProps {
  label: string;
  levelId: string;
  mode: string;
  votes: Record<string, string>;
  yourPlayerId: string;
}

export default function Race(props: IRaceProps) {
  const { label, levelId, mode, votes, yourPlayerId } = props;

  function handleClick(id: string) {
    return () => {
      Rune.actions.voteRace({
        playerId: yourPlayerId,
        race: id,
      });
    };
  }

  return (
    <li className={classNames("race", {
      "race--selected": mode === levelId,
      "race--discard": mode !== '' && mode !== levelId,
    })}>
      <button
        className="race__button"
        onClick={handleClick(levelId)}
        type="button"
      >
        <div className="race__button-label">{label}</div>
      </button>
      {Object.entries(votes)
        .filter(([, id]) => levelId === id)
        .map(([playerId]) => {
          const player = Rune.getPlayerInfo(playerId);
          return (
            <img
              className="race__player"
              key={playerId}
              src={player.avatarUrl}
            />
          );
        })}
    </li>
  );
}
