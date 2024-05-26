import { useEffect, useRef, useState } from "react";
import { World } from "@dimforge/rapier2d";

import { useBounds } from "../../hooks/useBounds";
import {
  countdownDurationSeconds,
  jumpForce,
  levels,
  physicsRatio,
  playerHeight,
  playerSpeed,
  playerWidth,
  updatesPerSecond,
} from "../../logic/config";
import {
  GameState,
  IPlayer,
  IPlayerPhysics,
  IPositionWithRotation,
} from "../../logic/types";
import { getPlayerPosition } from "../../helpers/player";
import { initWorld } from "../../helpers/world";

import Level from "../Level";
import Countdown from "../Countdown";
import { playSound, sounds } from "../../helpers/sounds";

import "./styles.css";

interface IGameProps {
  game: GameState;
  yourPlayerId: string;
}

export default function Game(props: IGameProps) {
  const { game, yourPlayerId } = props;
  const { levelIndex } = game;
  const level = levels[levelIndex];
  const { start } = level;
  const { bounds, ref } = useBounds();
  const world = useRef<World>();
  const playerPhysics = useRef<IPlayerPhysics>();
  const jump = useRef<false | number>(false);
  const jumpVelocity = useRef<number>(0);
  const lastTime = useRef<number>(0);
  const playerRef = useRef<HTMLDivElement>(null);
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
  const [position, setPosition] = useState<IPositionWithRotation>({
    ...start,
    z: 0,
  });

  useEffect(() => {
    const audio = sounds.music;
    audio.loop = true;
    audio.volume = 0.5;
    audio.play();
    return () => audio.pause();
  }, []);

  useEffect(() => {
    if (game.stage === "playing" && play) {
      playSound("go");
    }
  }, [game.stage, play]);

  useEffect(() => {
    // Init physics
    playerPhysics.current = initWorld(level, world);
  }, [level, game.playerIds, start]);

  useEffect(() => {
    if (game.stage === "playing" && play) {
      startTime.current = Rune.gameTime();
      const interval = setInterval(() => {
        if (world.current && playerPhysics.current) {
          const time = Rune.gameTime();
          const [nextPosition, restart] = getPlayerPosition(
            level,
            yourPlayerId,
            time,
            lastTime.current,
            startTime.current,
            player.current,
            world.current,
            playerPhysics.current,
            playerRef.current,
            jump,
            jumpVelocity
          );
          setPosition(nextPosition);
          if (restart) {
            // Reset player position...etc.
            playerRef.current?.classList.remove("level__player--reverse");
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
              true
            );
            setPosition({ ...start, z: 0 });
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
      playerRef.current?.classList.add("level__player--jump");
      playSound("jump");
    } else if (player.current.wallJump) {
      jump.current = Rune.gameTime();
      jumpVelocity.current = -jumpForce;
      player.current.speed = -player.current.speed;
      if (player.current.speed < 0) {
        playerRef.current?.classList.add("level__player--reverse");
      } else {
        playerRef.current?.classList.remove("level__player--reverse");
      }
      playerRef.current?.classList.add("level__player--jump");
      playSound("walljump");
    }
  }

  function endJump() {
    jump.current = false;
  }

  return (
    <>
      <div
        className="game"
        onMouseDown={startJump}
        onMouseUp={endJump}
        onTouchStart={startJump}
        onTouchEnd={endJump}
        ref={ref}
      >
        <Level
          bounds={bounds}
          level={level}
          playerRef={playerRef}
          x={position.x}
          y={position.y}
          z={position.z}
        />
      </div>
      {countdown > 0 && <Countdown countdownTimer={countdown} />}
    </>
  );
}
