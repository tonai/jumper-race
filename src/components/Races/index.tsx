import { RefObject, useEffect } from "react"

import { levels } from "../../constants/levels"
import { playSound } from "../../helpers/sounds"

import Race from "../Race"

import "./styles.css"

interface IRacesProps {
  mode: string
  playerBestTimes?: Record<string, number>
  playerIds: string[]
  volume: RefObject<number>
  votes: Record<string, string>
  yourPlayerId: string
}

export default function Races(props: IRacesProps) {
  const { mode, playerBestTimes, playerIds, volume, votes, yourPlayerId } =
    props

  useEffect(() => {
    if (mode) {
      playSound("select", volume.current)
      const timeout = setTimeout(() => Rune.actions.startRace(), 2000)
      return () => clearTimeout(timeout)
    }
  }, [mode, volume])

  return (
    <div className="races">
      <div className="races__group">
        <Race
          label="Championship 🏆"
          levelId="championship"
          mode={mode}
          votes={votes}
          yourPlayerId={yourPlayerId}
        />
        <h2 className="races__title">
          Select race (votes {Object.keys(votes).length}/{playerIds.length})
        </h2>
      </div>
      <div className="races__list">
        {levels.map((level) => (
          <Race
            key={level.id}
            label={`Race ${level.id}`}
            levelId={level.id}
            mode={mode}
            playerBestTime={playerBestTimes?.[level.id]}
            votes={votes}
            yourPlayerId={yourPlayerId}
          />
        ))}
      </div>
    </div>
  )
}
