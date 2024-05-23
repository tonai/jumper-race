import './styles.css';

export default function Start() {
  return (
    <div className="start">
      <button type="button" onClick={() => Rune.actions.setReady()}>
        Start
      </button>
    </div>
  );
}
