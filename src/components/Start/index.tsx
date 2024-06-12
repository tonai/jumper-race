import classNames from "classnames";
import { useEffect, useState } from "react";

import Blob from "../Blob";

import "./styles.css";
import { assetSize } from "../../constants/config";
import { randomInt } from "../../helpers/utils";
import { Persisted, Screen } from "../../logic/types";
import { startViewTransition } from "../../helpers/transition";
import Customize from "../Customize";

interface IStartProps {
  persisted: Record<string, Persisted>;
  playerIds: string[];
  screen: Screen;
  setScreen: (screen: Screen) => void;
  yourPlayerId: string;
}

const animations = ["squish", "roll", "jumpy"];

export default function Start(props: IStartProps) {
  const { persisted, playerIds, screen, setScreen, yourPlayerId } = props;
  const [squish, setSquish] = useState(false);
  const [blobAnimation, setBlobAnimation] = useState<[number, string]>([0, ""]);
  const [blobIndex, animation] = blobAnimation;

  function handleSquish() {
    setSquish(true);
  }

  useEffect(() => {
    if (squish) {
      const timeout = setTimeout(() => setSquish(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [squish]);

  useEffect(() => {
    if (screen === "start") {
      const interval = setInterval(() => {
        const blobIndex = randomInt(playerIds.length - 1);
        const animationIndex = randomInt(animations.length - 1);
        setBlobAnimation([blobIndex, animations[animationIndex]]);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [playerIds, screen]);

  function handleCustomize() {
    if (screen !== "customize") {
      startViewTransition(() => setScreen("customize"));
    }
  }

  function handleBack() {
    startViewTransition(() => setScreen("start"));
  }

  return (
    <div className="start">
      <div
        className="start__players"
        style={{ gap: `${2.4 - playerIds.length / 5}em` }}
      >
        <Blob
          className={[
            "start__player",
            "start__player--you",
            blobIndex === playerIds.length - 1 ? animation : "",
          ]}
          color={persisted[yourPlayerId].color}
          grounded={true}
          onClick={handleCustomize}
          shadow
          style={
            screen === "customize"
              ? {
                  transform:
                    `translateX(${assetSize * (playerIds.length - 2)}px) translateY(0) translateZ(0) scale(1.8)`,
                }
              : {}
          }
          x={-assetSize * 2}
          y={-assetSize * 2}
          z={0}
        />
        {playerIds
          .filter((id) => id !== yourPlayerId)
          .map((id, i) => {
            const player = Rune.getPlayerInfo(id);
            return (
              <Blob
                key={id}
                className={[
                  "start__player",
                  blobIndex === i ? animation : "",
                  { "start__player--hide": screen === "customize" },
                ]}
                color={persisted[id].color}
                grounded={true}
                name={player.displayName}
                shadow
                x={-assetSize * 2}
                y={-assetSize * 2}
                z={0}
              />
            );
          })}
      </div>
      {screen === "start" && (
        <>
          <h1
            className={classNames("start__title", {
              "start__title--squish": squish,
            })}
            onClick={handleSquish}
          >
            Jumper race
          </h1>
          <button
            className="start__button"
            type="button"
            onClick={() => setScreen("raceSelect")}
          >
            <span>
              Start race&nbsp;&nbsp;&nbsp;
              <div className="start__arrow" />
            </span>
          </button>
        </>
      )}
      {screen === "customize" && (
        <>
          <div className="start__customize">
            <button className="start__back" onClick={handleBack}>
              <span className="start__backArrow"></span>
            </button>
          </div>
          <Customize playerId={yourPlayerId} />
        </>
      )}
    </div>
  );
}
