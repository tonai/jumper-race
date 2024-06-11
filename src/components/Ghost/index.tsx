import { memo, useEffect, useState } from "react";

import { IPositionWithRotation, Stage } from "../../logic/types";

import Blob from "../Blob";
import { updatesPerSecond } from "../../logic/config";

interface IBlobProps {
  grounded: boolean;
  movementX: number;
  movementY: number;
  play: boolean;
  reverse?: boolean;
  stage: Stage;
  x: number;
  y: number;
  z: number;
}

function Ghost(props: IBlobProps) {
  const { movementX, movementY, play, reverse, stage, x, y, z } = props;
  const [position, setPosition] = useState<IPositionWithRotation>({ x, y, z });

  useEffect(() => {
    if (stage === "playing" && play) {
      const interval = setInterval(() => {
        setPosition(({ x, y, z }) => {
          return ({
            x: x + movementX,
            y: y + movementY,
            z: z,
          })
        });
      }, 1000 / updatesPerSecond);
      return () => clearInterval(interval);
    }
  }, [movementX, movementY, play, stage]);

  useEffect(() => {
    setPosition({ x, y, z });
  }, [x, y, z])

  return <Blob grounded={true} ghost reverse={reverse} {...position} />;
}

export default memo(Ghost);
