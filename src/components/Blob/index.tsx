import { MutableRefObject } from "react";

import { assetSize, playerHeight, playerWidth } from "../../logic/config";

import "./styles.css";

interface IBlobProps {
  playerRef: MutableRefObject<HTMLDivElement | null>;
  x: number;
  y: number;
  z: number;
}

function Blob(props: IBlobProps) {
  const { playerRef, x, y, z } = props;

  return (
    <div
      className="blob"
      ref={playerRef}
      style={{
        left: x + 2 * assetSize,
        top: y + 2 * assetSize,
        width: playerWidth,
        height: playerHeight,
        rotate: `${z}deg`,
      }}
    >
      <div className="blob__eye" />
    </div>
  );
}

export default Blob;
