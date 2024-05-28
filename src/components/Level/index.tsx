import { MutableRefObject, memo, useEffect, useMemo, useState } from "react";

import {
  assetSize,
  parallax,
  playerHeight,
  playerWidth,
  startCountdownDurationSeconds,
} from "../../logic/config";
import { ILevel, IPosition, IPositionWithRotation, Stage } from "../../logic/types";
import classNames from "classnames";
import { getBackground } from "../../helpers/background";

import "./styles.css";
import Blob from "../Blob";

interface ILevelProps {
  bounds: DOMRect;
  ghosts?: Record<string, IPositionWithRotation>;
  groundedPos: IPosition;
  level: ILevel;
  playerRef: MutableRefObject<HTMLDivElement | null>;
  stage: Stage;
  x: number;
  y: number;
  z: number;
}

function Level(props: ILevelProps) {
  const { bounds, ghosts, groundedPos, level, playerRef, stage, x, y, z } = props;
  const { blocks } = level;
  const width = level.width + 4 * assetSize;
  const height = level.height + 4 * assetSize;
  const left = (bounds.width - width) / 2;
  const top = (bounds.height - height) / 2;
  const translate = `${level.width / 2 - x - playerWidth / 2}px ${
    level.height / 2 - y - playerHeight / 2
  }px`;
  const parallaxTranslate = `${
    -x / parallax - playerWidth / 2 - 2 * assetSize
  }px 0px`;
  const background = useMemo(() => getBackground(level), [level]);
  const scale = Math.min(bounds.width / width, bounds.height / height);
  const [init, setInit] = useState(stage === "playing");

  useEffect(() => {
    const timeout = setTimeout(
      () => setInit(true),
      startCountdownDurationSeconds * 1000 - 2500,
    );
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <div
        className="level__parallax"
        style={{
          translate: parallaxTranslate,
        }}
      />
      <div
        className="level"
        style={{
          scale: init ? "1 1" : `${scale} ${scale}`,
          width,
          height,
          left,
          top,
        }}
      >
        <div
          className={classNames("level__map", {
            "level__map--init": stage === "countdown",
          })}
          style={{
            width,
            height,
            translate: init ? translate : "0 0",
          }}
        >
          {blocks
            .filter((block) => block.type === undefined)
            .map((block, i) => (
              <div
                key={i}
                className={classNames(
                  "level__block",
                  `level__block--${block.type ?? "ground"}`,
                )}
                style={{
                  left: block.x + 2 * assetSize - 1,
                  top: block.y + 2 * assetSize,
                  width: block.width + 2,
                  height: block.height - 2,
                }}
              />
            ))}
          <div
            className="level__background"
            style={{
              background,
              width,
              height,
            }}
          />
          {blocks
            .filter((block) => block.type !== undefined)
            .map((block, i) => (
              <div
                key={i}
                className={classNames(
                  "level__block",
                  `level__block--${block.type ?? "ground"}`,
                  { [`level__block--${block.direction}`]: block.direction },
                )}
                style={{
                  left: block.x + 2 * assetSize,
                  top: block.y + 2 * assetSize,
                  width: block.width,
                  height: block.height,
                }}
              />
            ))}
          <Blob playerRef={playerRef} x={x} y={y} z={z} />
          {ghosts &&
            Object.entries(ghosts).map(([playerId, ghost]) => (
              <div
                key={playerId}
                className="level__player level__player--ghost"
                // ref={playerRef}
                style={{
                  left: ghost.x + 2 * assetSize,
                  top: ghost.y + 2 * assetSize,
                  width: playerWidth,
                  height: playerHeight,
                  rotate: `${ghost.z}deg`,
                }}
              >
                <div className="level__player-eye" />
              </div>
            ))}
          <div
            className="level__grounded"
            key={`${groundedPos.x}-${groundedPos.y}`}
            style={{
              left: groundedPos.x + 2 * assetSize,
              top: groundedPos.y + 2 * assetSize,
              width: playerWidth,
              height: playerHeight,
            }}
          ></div>
        </div>
      </div>
    </>
  );
}

const MemoLevel = memo(Level);
export default MemoLevel;
