import classNames from "classnames";
import { useEffect, useState } from "react";

import Blob from "../Blob";

import "./styles.css";
import { assetSize } from "../../constants/config";
import { randomInt } from "../../helpers/utils";

interface IStartProps {
  playerIds: string[];
  yourPlayerId: string;
}

const animations = ['squish', 'roll', 'jumpy'];

export default function Start(props: IStartProps) {
  const { playerIds, yourPlayerId } = props;
  const [squish, setSquish] = useState(false);
  const [blobAnimation, setBlobAnimation] = useState<[number, string]>([0, '']);
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
    const interval = setInterval(() => {
      const blobIndex = randomInt(playerIds.length - 1);
      const animationIndex = randomInt(animations.length - 1);
      setBlobAnimation([blobIndex, animations[animationIndex]]);
    }, 5000);
    return () => clearInterval(interval);
  }, [playerIds]);

  return (
    <div className="start">
      <div className="start__players" style={{ gap: `${2.4 - playerIds.length / 5}em` }}>
        <Blob
          className={["start__player", "start__player--you", blobIndex === playerIds.length - 1 ? animation : '']}
          grounded={true}
          shadow
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
                className={["start__player", blobIndex === i ? animation : '']}
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
      <div className="start__screen">
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
          onClick={() => Rune.actions.setReady()}
        >
          <span>
            Start race&nbsp;&nbsp;&nbsp;
            <div className="start__arrow" />
          </span>
        </button>
      </div>
    </div>
  );
}
