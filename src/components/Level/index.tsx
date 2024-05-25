import { useEffect, useMemo, useRef, useState } from "react";
import { World } from "@dimforge/rapier2d";

import { useBounds } from "../../hooks/useBounds";
import {
  assetSize,
  countdownDurationSeconds,
  jumpForce,
  physicsRatio,
  playerHeight,
  playerSpeed,
  playerWidth,
  updatesPerSecond,
} from "../../logic/config";
import { GameState, IPlayer, IPlayerPhysics } from "../../logic/types";
import { getPlayerPosition } from "../../helpers/player";
import Countdown from "../Countdown";
import classNames from "classnames";
import { initWorld } from "../../helpers/world";
import { getBackground } from "../../helpers/background";

import "./styles.css";

interface ILevelProps {
  game: GameState;
  yourPlayerId: string;
}

export default function Level(props: ILevelProps) {
  const { game, yourPlayerId } = props;
  const { level } = game;
  const { width, height, blocks, start } = level;
  const { bounds, ref } = useBounds();
  const world = useRef<World>();
  const playerPhysics = useRef<IPlayerPhysics>();
  const jump = useRef<false | number>(false);
  const jumpVelocity = useRef<number>(0);
  const lastTime = useRef<number>(0);
  const player = useRef<IPlayer>({
    ...start,
    speed: playerSpeed,
    grounded: true,
    wallJump: false,
  });
  const startCountdown = useRef(0);
  const startTime = useRef(0);
  const [play, setPlay] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [position, setPosition] = useState({ ...start });
  const translate = `${
    (bounds?.width ?? 0) / 2 - position.x - playerWidth / 2 - 2 * assetSize
  }px ${
    (bounds?.height ?? 0) / 2 - position.y - playerHeight / 2 - 2 * assetSize
  }px`;
  const parallaxTranslate = `${
    (bounds?.width ?? 0) / 2 - position.x / 10 - playerWidth / 2 - 2 * assetSize
  }px 0px`;
  const background = useMemo(() => getBackground(level), [level]);

  useEffect(() => {
    // Init physics
    playerPhysics.current = initWorld(game.level, world);
  }, [game.level, game.playerIds, start]);

  useEffect(() => {
    if (game.stage === "playing" && play) {
      startTime.current = Rune.gameTime();
      const interval = setInterval(() => {
        if (world.current && playerPhysics.current) {
          const time = Rune.gameTime();
          const [position, restart] = getPlayerPosition(
            level,
            yourPlayerId,
            time,
            lastTime.current,
            startTime.current,
            player.current,
            world.current,
            playerPhysics.current,
            jump,
            jumpVelocity,
          );
          setPosition(position);
          if (restart) {
            // Reset player position...etc.
            player.current = {
              ...start,
              speed: playerSpeed,
              grounded: true,
              wallJump: false,
            };
            playerPhysics.current.rigidBody.setTranslation(
              {
                x: (start.x + playerWidth / 2) / physicsRatio,
                y: (start.y + playerHeight / 2) / physicsRatio,
              },
              true,
            );
            setPosition({ ...start });
            setPlay(false);
            setCountdown(countdownDurationSeconds);
            startCountdown.current = time;
          }
          lastTime.current = time;
        }
      }, 1000 / updatesPerSecond);
      return () => clearInterval(interval);
    }
  }, [game.stage, level, play, start, yourPlayerId]);

  useEffect(() => {
    if (countdown) {
      // Manage countdown when player restart level
      const interval = setInterval(() => {
        const timePassed = (Rune.gameTime() - startCountdown.current) / 1000;
        if (timePassed > countdownDurationSeconds) {
          setCountdown(0);
          setPlay(true);
        } else {
          setCountdown(Math.ceil(countdownDurationSeconds - timePassed));
        }
      }, 1000 / updatesPerSecond);
      return () => clearInterval(interval);
    }
  }, [countdown]);

  function startJump() {
    if (player.current.grounded) {
      jump.current = Rune.gameTime();
      jumpVelocity.current = -jumpForce;
    } else if (player.current.wallJump) {
      jump.current = Rune.gameTime();
      jumpVelocity.current = -jumpForce;
      player.current.speed = -player.current.speed;
    }
  }

  function endJump() {
    jump.current = false;
  }

  return (
    <>
      <div
        className="level"
        onMouseDown={startJump}
        onMouseUp={endJump}
        onTouchStart={startJump}
        onTouchEnd={endJump}
        ref={ref}
      >
        <div
          className="level__parallax"
          style={{
            translate: parallaxTranslate,
          }}
        />
        <div
          className="level__map"
          style={{
            width: width + 4 * assetSize,
            height: height + 4 * assetSize,
            translate,
          }}
        >
          {blocks.map((block, i) => (
            <div
              key={i}
              className={classNames(
                "level__block",
                `level__block--${block.type ?? "ground"}`,
              )}
              style={{
                left:
                  block.x + 2 * assetSize - (block.type === undefined ? 1 : 0),
                top: block.y + 2 * assetSize,
                width: block.width + (block.type === undefined ? 2 : 0),
                height: block.height - (block.type === undefined ? 2 : 0),
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
          <div
            className="level__player"
            style={{
              left: position.x + 2 * assetSize,
              top: position.y + 2 * assetSize,
              width: playerWidth,
              height: playerHeight,
            }}
          />
        </div>
        {/* <div style={{ backgroundColor: 'white', width: '100%', height: '2px', position: 'absolute', top: '50%' }}></div>
        <div style={{ backgroundColor: 'white', width: '2px', height: '100%', position: 'absolute', left: '50%', top: 0 }}></div> */}
      </div>
      {countdown > 0 && <Countdown countdownTimer={countdown} />}
    </>
  );
}
