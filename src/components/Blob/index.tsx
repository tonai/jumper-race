import { MutableRefObject } from "react";

import { assetSize, playerHeight, playerWidth } from "../../constants/config";

import "./styles.css";
import classNames from "classnames";

interface IBlobProps {
  className?:
    | string
    | Record<string, boolean>
    | (string | Record<string, boolean>)[];
  ghost?: boolean;
  grounded?: boolean;
  name?: string;
  playerRef?: MutableRefObject<HTMLDivElement | null>;
  reverse?: boolean;
  shadow?: boolean;
  x: number;
  y: number;
  z: number;
}

function Blob(props: IBlobProps) {
  const { className, ghost, grounded, name, playerRef, reverse, shadow, x, y, z } = props;

  return (
    <div
      className={classNames(
        "blob",
        { ghost, jump: !grounded, reverse },
        className,
      )}
      ref={playerRef}
      style={{
        left: x + 2 * assetSize,
        top: y + 2 * assetSize,
        width: playerWidth,
        height: playerHeight,
      }}
    >
      <div
        className="blob__body"
        style={{
          rotate: `${z}deg`,
        }}
      >
        <div className="blob__eye" />
      </div>
      {name && <div className="blob__name">{name}</div>}
      {shadow && (<div className="blob__shadow"></div>)}
    </div>
  );
}

export default Blob;
