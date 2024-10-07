import { levels } from "../../constants/levels"

import "./styles.css"

interface ITimer {
  levelIndex: number
  timer: number
}

export default function Timer(props: ITimer) {
  const { levelIndex, timer } = props
  const level = levels[levelIndex]

  return <div className="timer">{level.totalTime - timer}</div>
}
