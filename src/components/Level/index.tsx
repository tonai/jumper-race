import { MutableRefObject, memo, useMemo } from "react";

import {
  assetSize,
  parallax,
  playerHeight,
  playerWidth,
} from "../../logic/config";
import { ILevel } from "../../logic/types";
import classNames from "classnames";
import { getBackground } from "../../helpers/background";

import "./styles.css";

interface ILevelProps {
  bounds?: DOMRect;
  level: ILevel;
  playerRef: MutableRefObject<HTMLDivElement | null>;
  x: number;
  y: number;
  z: number;
}

function Level(props: ILevelProps) {
  const { bounds, level, playerRef, x, y, z } = props;
  const { width, height, blocks } = level;
  const translate = `${
    (bounds?.width ?? 0) / 2 - x - playerWidth / 2 - 2 * assetSize
  }px ${(bounds?.height ?? 0) / 2 - y - playerHeight / 2 - 2 * assetSize}px`;
  const parallaxTranslate = `${
    (bounds?.width ?? 0) / 2 - x / parallax - playerWidth / 2 - 2 * assetSize
  }px 0px`;
  const background = useMemo(() => getBackground(level), [level]);

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
          width: width + 4 * assetSize,
          height: height + 4 * assetSize,
        }}
      >
        <div
          className="level__map"
          style={{
            width: width + 4 * assetSize,
            height: height + 4 * assetSize,
            translate,
          }}
        >
          {blocks
            .filter((block) => block.type === undefined)
            .map((block, i) => (
              <div
                key={i}
                className={classNames(
                  "level__block",
                  `level__block--${block.type ?? "ground"}`
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
              width: width + 4 * assetSize,
              height: height + 4 * assetSize,
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
                  { [`level__block--${block.direction}`]: block.direction }
                )}
                style={{
                  left: block.x + 2 * assetSize,
                  top: block.y + 2 * assetSize,
                  width: block.width,
                  height: block.height,
                }}
              />
            ))}
          <div
            className="level__player"
            ref={playerRef}
            style={{
              left: x + 2 * assetSize,
              top: y + 2 * assetSize,
              width: playerWidth,
              height: playerHeight,
              rotate: `${z}deg`,
            }}
          >
            <div className="level__player-eye" />
          </div>
        </div>
      </div>
    </>
  );
}

const MemoLevel = memo(Level);
export default MemoLevel;
