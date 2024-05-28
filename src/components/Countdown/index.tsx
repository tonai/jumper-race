import { useEffect } from "react";

import { playSound } from "../../helpers/sounds";

import "./styles.css";

interface ICountdownProps {
  countdownTimer: number;
}

export default function Countdown(props: ICountdownProps) {
  const { countdownTimer } = props;

  useEffect(() => {
    playSound("countdown");
  }, [countdownTimer]);

  return (
    <div className="countdown">
      <div className="countdown__timer" key={countdownTimer}>{countdownTimer}</div>
    </div>
  );
}
