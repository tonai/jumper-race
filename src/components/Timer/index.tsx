import './styles.css';

interface ITimer {
  timer: number;
}

export default function Timer(props: ITimer) {
  const { timer } = props;
  return <div className="timer">{timer}</div>;
}
