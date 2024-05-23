import './styles.css';

interface ICountdownProps {
  countdownTimer: number
}

export default function Countdown(props: ICountdownProps) {
  const { countdownTimer } = props;

  return (
    <div className="countdown">
      {countdownTimer}
    </div>
  );
}