import { HTMLAttributes, MutableRefObject } from "react";

import {
  assetSize,
  colors,
  playerHeight,
  playerWidth,
} from "../../constants/config";

import "./styles.css";
import classNames from "classnames";

interface IBlobProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "className" | "color"> {
  className?:
    | string
    | Record<string, boolean>
    | (string | Record<string, boolean>)[];
  color?: number;
  ghost?: boolean;
  grounded?: boolean;
  name?: string;
  onClick?: () => void;
  playerRef?: MutableRefObject<HTMLDivElement | null>;
  reverse?: boolean;
  shadow?: boolean;
  x: number;
  y: number;
  z: number;
}

function Blob(props: IBlobProps) {
  const {
    children,
    className,
    color,
    ghost,
    grounded,
    name,
    onClick,
    playerRef,
    reverse,
    shadow,
    x,
    y,
    z,
    ...attrs
  } = props;
  const [backgroundColor, borderColor, shadowColor] = colors[color ?? 0];

  return (
    <div
      className={classNames(
        "blob",
        { ghost, jump: !grounded, reverse },
        className,
      )}
      ref={playerRef}
      onClick={onClick}
      {...attrs}
      style={{
        ...attrs.style,
        left: x + 2 * assetSize,
        top: y + 2 * assetSize,
        width: playerWidth,
        height: playerHeight,
      }}
    >
      <div
        className="blob__body"
        style={{
          backgroundColor,
          borderColor,
          rotate: `${z}deg`,
        }}
      >
        <div className="blob__eye" />
      </div>
      {name && <div className="blob__name">{name}</div>}
      {shadow && (
        <div
          className="blob__shadow"
          style={{
            background: `radial-gradient(${shadowColor}, ${shadowColor} 20%, transparent 50%)`,
          }}
        ></div>
      )}
      {children}
    </div>
  );
}

export default Blob;
