import { MutableRefObject } from "react";

import { assetSize, playerHeight, playerWidth } from "../../logic/config";

import "./styles.css";
import classNames from "classnames";

interface IBlobProps {
  ghost?: boolean;
  grounded?: boolean;
  name?: string;
  playerRef?: MutableRefObject<HTMLDivElement | null>;
  reverse?: boolean;
  x: number;
  y: number;
  z: number;
}

function Blob(props: IBlobProps) {
  const { ghost, grounded, name, playerRef, reverse, x, y, z } = props;

  return (
    <div
      className={classNames("blob", { ghost, jump: !grounded, reverse })}
      ref={playerRef}
      style={{
        left: x + 2 * assetSize,
        top: y + 2 * assetSize,
        width: playerWidth,
        height: playerHeight,
        rotate: `${z}deg`,
      }}
    >
      {name && (<div className="blob__name">{name}</div>)}
      <div className="blob__eye" />
    </div>
  );
}

export default Blob;
