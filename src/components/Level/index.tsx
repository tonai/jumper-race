import { useEffect, useRef, useState } from "react";
import { World } from "@dimforge/rapier2d";

import { useBounds } from "../../hooks/useBounds";
import {
  countdownDurationSeconds,
  jumpForce,
  physicsRatio,
  playerHeight,
  playerSpeed,
  playerWidth,
  updatesPerSecond,
} from "../../logic/config";
import { GameState, IPlayer, IPlayerPhysics } from "../../logic/types";

import "./styles.css";
import { getPlayerPosition } from "../../helpers/player";
import Countdown from "../Countdown";
import classNames from "classnames";
import { initWorld } from "../../helpers/world";

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
  });
  const startCountdown = useRef(0);
  const startTime = useRef(0);
  const [play, setPlay] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [position, setPosition] = useState({ ...start });
  const translate = `${(bounds?.width ?? 0) / 2 - position.x}px ${
    (bounds?.height ?? 0) / 2 - position.y
  }px`;

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
        <div style={{ width, height, translate }}>
          {blocks.map((block, i) => (
            <div
              key={i}
              className={classNames(
                "level__block",
                `level__block--${block.type ?? "ground"}`,
              )}
              style={{
                left: block.x,
                top: block.y,
                width: block.width,
                height: block.height,
              }}
            />
          ))}
          <div
            className="level__player"
            style={{
              left: position.x,
              top: position.y,
              width: playerWidth,
              height: playerHeight,
              // borderRadius: playerWidth / 2,
            }}
          />
        </div>
      </div>
      {countdown > 0 && <Countdown countdownTimer={countdown} />}
    </>
  );
}
