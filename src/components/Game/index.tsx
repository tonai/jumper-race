import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import type { World } from "@dimforge/rapier2d-compat";
import classNames from "classnames";
import { GameStateWithPersisted } from "rune-games-sdk";

import { useBounds } from "../../hooks/useBounds";
import {
  playCountdownDurationSeconds,
  jumpForce,
  physicsRatio,
  playerHeight,
  playerSpeed,
  playerWidth,
  updatesPerSecond,
} from "../../constants/config";
import { levels } from "../../constants/levels";
import {
  GameState,
  IPlayer,
  IPlayerPhysics,
  IPosition,
  IPositionWithRotation,
  Persisted,
} from "../../logic/types";
import { getPlayerPosition } from "../../helpers/player";
import { initWorld } from "../../helpers/world";

import Level from "../Level";
import Countdown from "../Countdown";
import { playMusic, playSound } from "../../helpers/sounds";

import "./styles.css";
import { formatTime } from "../../helpers/format";

interface IGameProps {
  game: GameStateWithPersisted<GameState, Persisted>;
  rapier: typeof import("@dimforge/rapier2d-compat/rapier");
  volume: RefObject<number>;
  volumeState: number;
  yourPlayerId: string;
}

export default function Game(props: IGameProps) {
  const { game, rapier, volume, volumeState, yourPlayerId } = props;
  const { levelIndex, scores } = game;
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
    isWallJumping: false,
    jumpStartTime: false,
    jumpVelocity: 0,
    movement: { x: 0, y: 0 },
    speed: playerSpeed,
    wallJump: false,
    z: 0,
  });
  const startCountdown = useRef(0);
  const startTime = useRef(0);
  const [play, setPlay] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [position, setPosition] = useState<IPositionWithRotation>({
    ...start,
    z: 0,
  });
  const [groundedPos, setGroundedPos] = useState<IPosition>({ ...start });
  const [raceTime, setRaceTime] = useState(0);
  const ghostUpdateCounter = useRef(0);
  const playerBest = scores?.[yourPlayerId][level.id].bestTime ?? Infinity;

  const restart = useCallback(
    (time: number) => {
      // Reset player position...etc.
      playerRef.current?.classList.remove("reverse");
      playerRef.current?.classList.remove("jump");
      player.current = {
        ...start,
        grounded: true,
        isWallJumping: false,
        jumpStartTime: false,
        jumpVelocity: 0,
        movement: { x: 0, y: 0 },
        speed: playerSpeed,
        wallJump: false,
        z: 0,
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
      Rune.actions.updatePosition({
        grounded: true,
        movement: player.current.movement,
        playerId: yourPlayerId,
        reverse: false,
        time: Rune.gameTime(),
        x: player.current.x,
        y: player.current.y,
        z: player.current.z,
      });
      ghostUpdateCounter.current = 0;
    },
    [start, yourPlayerId],
  );

  useEffect(() => {
    music.current = playMusic("music", volume.current ?? 1);
    return () => music.current?.pause();
  }, [music, volume]);

  useEffect(() => {
    if (music.current) {
      music.current.volume = 0.5 * volumeState;
    }
  }, [volumeState]);

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
          const prevPlayer = { ...player.current };
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
            volume.current,
            setRaceTime,
          );
          if (player.current.grounded && !prevPlayer.grounded) {
            playerRef.current?.classList.remove("jump");
            setGroundedPos({ x: nextPosition.x, y: nextPosition.y });
          }
          // Update ghost position only 1 time per 5 frames
          ghostUpdateCounter.current--;
          if (ghostUpdateCounter.current < 0) {
            Rune.actions.updatePosition({
              ...nextPosition,
              grounded: player.current.grounded,
              movement: player.current.movement,
              playerId: yourPlayerId,
              time: Rune.gameTime(),
              reverse: player.current.speed < 0,
            });
            ghostUpdateCounter.current = 4;
          }
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
      playerRef.current?.classList.add("jump");
      playSound("jump", volume.current);
    } else if (player.current.wallJump) {
      player.current.jumpStartTime = Rune.gameTime();
      player.current.jumpVelocity = -jumpForce;
      player.current.speed = -player.current.speed;
      player.current.wallJump = false;
      player.current.isWallJumping = true;
      if (player.current.speed < 0) {
        playerRef.current?.classList.add("reverse");
      } else {
        playerRef.current?.classList.remove("reverse");
      }
      playerRef.current?.classList.add("jump");
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
            ghosts={game.ghosts}
            groundedPos={groundedPos}
            level={level}
            persisted={game.persisted}
            play={play}
            playerId={yourPlayerId}
            playerRef={playerRef}
            stage={game.stage}
            x={position.x}
            y={position.y}
            z={position.z}
          />
        )}
      </div>
      {countdown > 0 && (
        <Countdown countdownTimer={countdown} volume={volume} />
      )}
      <button className="game__restart" onClick={handleRestart} type="button">
        <div className="game__arrow">↺</div>
      </button>
      {raceTime > 0 && (
        <div
          className={classNames("game__raceTime", {
            "game__raceTime--good": raceTime <= playerBest,
            "game__raceTime--bad": raceTime > playerBest,
          })}
          key={raceTime}
        >
          {formatTime(raceTime)}
        </div>
      )}
    </div>
  );
}
