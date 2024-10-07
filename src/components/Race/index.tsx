import classNames from "classnames"
import "./styles.css"
import { formatTime } from "../../helpers/format"

interface IRaceProps {
  label: string
  levelId: string
  mode: string
  playerBestTime?: number
  votes: Record<string, string>
  yourPlayerId: string
}

export default function Race(props: IRaceProps) {
  const { label, levelId, mode, playerBestTime, votes, yourPlayerId } = props

  function handleClick(id: string) {
    return () => {
      Rune.actions.voteRace({
        playerId: yourPlayerId,
        race: id,
      })
    }
  }

  return (
    <div
      className={classNames("race", {
        "race--selected": mode === levelId,
        "race--discard": mode !== "" && mode !== levelId,
      })}
    >
      <div className="race__group">
        <button
          className="race__button"
          onClick={handleClick(levelId)}
          type="button"
        >
          <div className="race__button-label">{label}</div>
        </button>
        {levelId !== "championship" && (
          <div className="race__time">
            {playerBestTime ? formatTime(playerBestTime) : "--.--"}
          </div>
        )}
      </div>
      {Object.entries(votes)
        .filter(([, id]) => levelId === id)
        .map(([playerId]) => {
          const player = Rune.getPlayerInfo(playerId)
          return (
            <img
              className="race__player"
              key={playerId}
              src={player.avatarUrl}
            />
          )
        })}
    </div>
  )
}
