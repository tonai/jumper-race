import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import type { World } from "@dimforge/rapier2d-compat";

import { useBounds } from "../../hooks/useBounds";
import {
  playCountdownDurationSeconds,
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
  rapier: typeof import("@dimforge/rapier2d-compat/rapier");
  volume: RefObject<number>;
  volumeState: number;
  yourPlayerId: string;
}

export default function Game(props: IGameProps) {
  const { game, rapier, volume, volumeState, yourPlayerId } = props;
  const { levelIndex } = game;
  const level = levels[levelIndex];
  const { start } = level;
  const { bounds, ref } = useBounds();
  const music = useRef<HTMLAudioElement>();
  const world = useRef<World>();
  const playerPhysics = useRef<IPlayerPhysics>();
  const lastTime = useRef<number>(0);
  const playerRef = useRef<HTMLDivElement>(null);
  const player = useRef<IPlayer>({
    ...start,
    grounded: true,
    jumpStartTime: false,
    jumpVelocity: 0,
    speed: playerSpeed,
    wallJump: false,
    isWallJumping: false,
  });
  const startCountdown = useRef(0);
  const startTime = useRef(0);
  const [play, setPlay] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [position, setPosition] = useState<IPositionWithRotation>({
    ...start,
    z: 0,
  });

  const restart = useCallback(
    (time: number) => {
      // Reset player position...etc.
      playerRef.current?.classList.remove("level__player--reverse");
      player.current = {
        ...start,
        grounded: true,
        jumpStartTime: false,
        jumpVelocity: 0,
        speed: playerSpeed,
        wallJump: false,
        isWallJumping: false,
      };
      playerPhysics.current?.rigidBody.setTranslation(
        {
          x: (start.x + playerWidth / 2) / physicsRatio,
          y: (start.y + playerHeight / 2) / physicsRatio,
        },
        true,
      );
      setPosition({ ...start, z: 0 });
      setPlay(false);
      setCountdown(playCountdownDurationSeconds);
      startCountdown.current = time;
    },
    [start],
  );

  useEffect(() => {
    music.current = sounds.music;
    music.current.loop = true;
    music.current.volume = 0.5 * (volume.current ?? 1);
    music.current.play();
    return () => music.current?.pause();
  }, [music, volume]);

  useEffect(() => {
    if (music.current) {
      music.current.volume = 0.5 * volumeState;
    }
  }, [volumeState])

  useEffect(() => {
    if (game.stage === "playing" && play) {
      playSound("go", volume.current);
    }
  }, [game.stage, play, volume]);

  useEffect(() => {
    // Init physics
    playerPhysics.current = initWorld(rapier, level, world);
  }, [level, rapier, start]);

  useEffect(() => {
    if (game.stage === "playing" && play) {
      startTime.current = Rune.gameTime();
      const interval = setInterval(() => {
        if (world.current && playerPhysics.current) {
          const time = Rune.gameTime();
          const [nextPosition, shouldRestart] = getPlayerPosition(
            rapier,
            level,
            yourPlayerId,
            time,
            lastTime.current,
            startTime.current,
            player.current,
            world.current,
            playerPhysics.current,
            playerRef.current,
            volume.current
          );
          setPosition(nextPosition);
          if (shouldRestart) {
            restart(time);
          }
          lastTime.current = time;
        }
      }, 1000 / updatesPerSecond);
      return () => clearInterval(interval);
    }
  }, [game.stage, level, play, rapier, restart, volume, yourPlayerId]);

  useEffect(() => {
    if (countdown) {
      // Manage countdown when player restart level
      const interval = setInterval(() => {
        const timePassed = (Rune.gameTime() - startCountdown.current) / 1000;
        if (timePassed > playCountdownDurationSeconds) {
          setCountdown(0);
          setPlay(true);
        } else {
          setCountdown(Math.ceil(playCountdownDurationSeconds - timePassed));
        }
      }, 1000 / updatesPerSecond);
      return () => clearInterval(interval);
    }
  }, [countdown]);

  function startJump() {
    if (player.current.grounded) {
      player.current.jumpStartTime = Rune.gameTime();
      player.current.jumpVelocity = -jumpForce;
      playerRef.current?.classList.add("level__player--jump");
      playSound("jump", volume.current);
    } else if (player.current.wallJump) {
      player.current.jumpStartTime = Rune.gameTime();
      player.current.jumpVelocity = -jumpForce;
      player.current.speed = -player.current.speed;
      player.current.wallJump = false;
      player.current.isWallJumping = true;
      if (player.current.speed < 0) {
        playerRef.current?.classList.add("level__player--reverse");
      } else {
        playerRef.current?.classList.remove("level__player--reverse");
      }
      playerRef.current?.classList.add("level__player--jump");
      playSound("walljump", volume.current);
    }
  }

  function endJump() {
    player.current.jumpStartTime = false;
  }

  function handleRestart() {
    restart(Rune.gameTime());
  }

  return (
    <div className="game">
      <div
        className="game__level"
        onMouseDown={startJump}
        onMouseUp={endJump}
        onTouchStart={startJump}
        onTouchEnd={endJump}
        ref={ref}
      >
        {bounds && (
          <Level
            bounds={bounds}
            level={level}
            playerRef={playerRef}
            stage={game.stage}
            x={position.x}
            y={position.y}
            z={position.z}
          />
        )}
      </div>
      {countdown > 0 && <Countdown countdownTimer={countdown} volume={volume} />}
      <button className="game__restart" onClick={handleRestart} type="button">
        <div className="game__arrow">↺</div>
      </button>
    </div>
  );
}
