import classNames from "classnames";
import "./styles.css";
import { useEffect, useState } from "react";

export default function Start() {
  const [squish, setSquish] = useState(false);

  function handleSquish() {
    setSquish(true);
  }

  useEffect(() => {
    if (squish) {
      const timeout = setTimeout(() => setSquish(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [squish]);

  return (
    <div className="start">
      <h1
        className={classNames("start__title", {
          "start__title--squish": squish,
        })}
        onClick={handleSquish}
      >
        Jumper racer
      </h1>
      <button
        className="start__button"
        type="button"
        onClick={() => Rune.actions.setReady()}
      >
        <span>
          Start race&nbsp;&nbsp;&nbsp;
          <div className="start__arrow" />
        </span>
      </button>
    </div>
  );
}
