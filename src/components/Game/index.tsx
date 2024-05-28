import {
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
  IPosition,
  IPositionWithRotation,
} from "../../logic/types";
import { getPlayerPosition } from "../../helpers/player";
import { initGhosts, initWorld } from "../../helpers/world";

import Level from "../Level";
import Countdown from "../Countdown";
import { playMusic, playSound } from "../../helpers/sounds";

import "./styles.css";
import { formatTime } from "../../helpers/format";
import classNames from "classnames";

interface IGameProps {
  game: GameState;
  isGhostsEnabled: boolean;
  rapier: typeof import("@dimforge/rapier2d-compat/rapier");
  setIsGhostsEnabled: Dispatch<SetStateAction<boolean>>;
  volume: RefObject<number>;
  volumeState: number;
  yourPlayerId: string;
}

export default function Game(props: IGameProps) {
  const { game, isGhostsEnabled, rapier, setIsGhostsEnabled, volume, volumeState, yourPlayerId } = props;
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
    jumpStartTime: false,
    jumpVelocity: 0,
    speed: playerSpeed,
    wallJump: false,
    isWallJumping: false,
  });
  const startCountdown = useRef(0);
  const startTime = useRef(0);
  const ghostsPhysics = useRef<Record<string, IPlayerPhysics>>({});
  const ghosts = useRef<Record<string, IPlayer>>({});

  const [play, setPlay] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [position, setPosition] = useState<IPositionWithRotation>({
    ...start,
    z: 0,
  });
  const [groundedPos, setGroundedPos] = useState<IPosition>({ ...start });
  const [raceTime, setRaceTime] = useState(0);
  const playerBest = scores?.[yourPlayerId][level.id].bestTime ?? Infinity;
  const [ghostsPosition, setGhostsPosition] = useState<
    Record<string, IPositionWithRotation>
  >({});

  const restart = useCallback(
    (time: number) => {
      // Reset player position...etc.
      playerRef.current?.classList.remove("reverse");
      playerRef.current?.classList.remove("jump");
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
      Rune.actions.ghostRestart(yourPlayerId);
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
    playerPhysics.current = initWorld(rapier, level, world, yourPlayerId);
  }, [level, rapier, start, yourPlayerId]);

  useEffect(() => {
    // Init ghosts
    const playerIds = game.playerIds.filter((id) => id !== yourPlayerId);
    if (world.current) {
      ghostsPhysics.current = initGhosts(
        rapier,
        world.current,
        level,
        playerIds,
        ghostsPhysics.current,
        ghosts,
      );
    }
  }, [game.playerIds, level, rapier, yourPlayerId]);

  useEffect(() => {
    if (game.stage === "playing" && play) {
      startTime.current = Rune.gameTime();
      const interval = setInterval(() => {
        if (world.current && playerPhysics.current) {
          const time = Rune.gameTime();
          const prevGrounded = player.current.grounded;
          const [nextPosition, shouldRestart] = getPlayerPosition(
            rapier,
            level,
            time,
            lastTime.current,
            startTime.current,
            player.current,
            world.current,
            playerPhysics.current,
            volume.current,
            setRaceTime,
            playerRef.current,
            yourPlayerId,
          );
          if (player.current.grounded && !prevGrounded) {
            playerRef.current?.classList.remove("jump");
            setGroundedPos({ x: nextPosition.x, y: nextPosition.y });
          }
          setPosition(nextPosition);
          if (shouldRestart) {
            restart(time);
          }
          if (isGhostsEnabled) {
            // Ghosts
            const positions = Object.fromEntries(
              Object.entries(ghosts.current).map(([playerId, ghost]) => {
                const [nextPosition] = getPlayerPosition(
                  rapier,
                  level,
                  time,
                  lastTime.current,
                  startTime.current,
                  ghost,
                  world.current!,
                  ghostsPhysics.current[playerId],
                );
                return [playerId, nextPosition];
              }),
            );
            setGhostsPosition(positions);
          }
          lastTime.current = time;
        }
      }, 1000 / updatesPerSecond);
      return () => clearInterval(interval);
    }
  }, [game.stage, isGhostsEnabled, level, play, rapier, restart, volume, yourPlayerId]);

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

  useEffect(() => {
    Object.entries(game.ghosts)
      .filter(([playerId]) => playerId !== yourPlayerId)
      .forEach(([playerId, data]) => {
        const { action, speed, time, velocity } = data;
        switch (action) {
          case "idle":
            ghosts.current[playerId].jumpStartTime = false;
            return;
          case "jump":
            ghosts.current[playerId].jumpStartTime = time as number;
            ghosts.current[playerId].speed = speed as number;
            ghosts.current[playerId].jumpVelocity = velocity as number;
            return;
          case "restart":
            ghosts.current[playerId] = {
              ...start,
              isWallJumping: false,
              jumpStartTime: false,
              jumpVelocity: 0,
              speed: playerSpeed,
              grounded: true,
              wallJump: false,
            };
            ghostsPhysics.current?.[playerId].rigidBody.setTranslation(
              {
                x: (start.x + playerWidth / 2) / physicsRatio,
                y: (start.y + playerHeight / 2) / physicsRatio,
              },
              true,
            );
            setGhostsPosition((ghosts) =>
              Object.fromEntries(
                Object.entries(ghosts).map(([id, ghost]) => [
                  id,
                  playerId === id ? { ...start, z: 0 } :  ghost,
                ]),
              ),
            );
            return;
        }
      });
  }, [game.ghosts, start, yourPlayerId]);

  function startJump() {
    if (player.current.grounded) {
      player.current.jumpStartTime = Rune.gameTime();
      player.current.jumpVelocity = -jumpForce;
      playerRef.current?.classList.add("jump");
      playSound("jump", volume.current);
      Rune.actions.ghostJumpStart({
        playerId: yourPlayerId,
        speed: player.current.speed,
        time: player.current.jumpStartTime,
        velocity: player.current.jumpVelocity,
      });
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
      Rune.actions.ghostJumpStart({
        playerId: yourPlayerId,
        speed: player.current.speed,
        time: player.current.jumpStartTime,
        velocity: player.current.jumpVelocity,
      });
    }
  }

  function endJump() {
    player.current.jumpStartTime = false;
    Rune.actions.ghostJumpEnd(yourPlayerId);
  }

  function handleRestart() {
    restart(Rune.gameTime());
  }

  function handleGhosts() {
    setIsGhostsEnabled((x) => !x);
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
            ghosts={isGhostsEnabled ? ghostsPosition : undefined}
            groundedPos={groundedPos}
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
      <button
        className={classNames("game__ghosts", {
          "game__ghosts--enabled": isGhostsEnabled,
        })}
        onClick={handleGhosts}
        type="button"
      >
        {isGhostsEnabled ? "✓ Disable ghosts" : "❌ Enable ghosts"}
      </button>
      <button className="game__restart" onClick={handleRestart} type="button">
        <div className="game__arrow">↺</div>
      </button>
      {raceTime && (
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
