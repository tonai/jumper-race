import { RefObject, useEffect } from "react"

import { playSound } from "../../helpers/sounds"

import "./styles.css"

interface ICountdownProps {
  countdownTimer: number
  volume: RefObject<number>
}

export default function Countdown(props: ICountdownProps) {
  const { countdownTimer, volume } = props

  useEffect(() => {
    playSound("countdown", volume.current)
  }, [countdownTimer, volume])

  return (
    <div className="countdown">
      <div className="countdown__timer" key={countdownTimer}>
        {countdownTimer}
      </div>
    </div>
  )
}
