import { useEffect, useRef, useState } from "react";
import { ColliderDesc, RigidBodyDesc, World } from "@dimforge/rapier2d";

import { useBounds } from "../../hooks/useBounds";
import {
  countdownDurationSeconds,
  gravity,
  jumpForce,
  maxJumpTime,
  physicsRatio,
  playerHeight,
  playerOffset,
  playerSpeed,
  playerWidth,
  updatesPerSecond,
} from "../../logic/config";
import { GameState, IPlayer, IPlayerPhysics } from "../../logic/types";

import "./styles.css";
import { getPlayerPosition } from "../../helpers/player";
import Countdown from "../Countdown";

interface ILevelProps {
  game: GameState;
  yourPlayerId: string;
}

export default function Level(props: ILevelProps) {
  const { game, yourPlayerId } = props;
  const { level } = game;
  const { width, height, blocks, end, start } = level;
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
    // World physics
    world.current = new World(gravity);
    world.current.timestep = 1 / updatesPerSecond;
    game.level.blocks.forEach((block) => {
      const rigidBodyDesc = RigidBodyDesc.fixed().setTranslation(
        (block.x + block.width / 2) / physicsRatio,
        (block.y + block.height / 2) / physicsRatio,
      );
      const rigidBody = world.current?.createRigidBody(rigidBodyDesc);
      const colliderDesc = ColliderDesc.cuboid(
        block.width / 2 / physicsRatio,
        block.height / 2 / physicsRatio,
      ); /*.setCollisionGroups(
        2 ** 16 + 2 ** 17 + 2 ** 18 + 2 ** 19 + 2 ** 20 + 2 ** 21 + 63,
      )*/
      world.current?.createCollider(colliderDesc, rigidBody);
    });

    // Player physics
    const rigidBodyDesc = RigidBodyDesc.kinematicPositionBased().setTranslation(
      (start.x + playerWidth / 2) / physicsRatio,
      (start.y + playerHeight / 2) / physicsRatio,
    );
    // const rigidBodyDesc = RigidBodyDesc.dynamic().setTranslation(
    //   (start.x + playerWidth / 2) / physicsRatio,
    //   (start.y + playerHeight / 2) / physicsRatio,
    // );
    const rigidBody = world.current?.createRigidBody(rigidBodyDesc);
    // const colliderDesc = ColliderDesc.capsule(
    //   playerHeight / 4 / physicsRatio,
    //   playerWidth / 2 / physicsRatio,
    // );
    const colliderDesc = ColliderDesc.cuboid(
      playerWidth / 2 / physicsRatio,
      playerHeight / 2 / physicsRatio,
    ); /*.setCollisionGroups(2 ** (16 + i) + i + 1)*/
    const collider = world.current?.createCollider(colliderDesc, rigidBody);
    const controller = world.current?.createCharacterController(playerOffset);
    // controller.setApplyImpulsesToDynamicBodies(true);
    controller.enableSnapToGround(playerOffset);
    // controller.setCharacterMass(1);
    controller.setUp({ x: 0.0, y: -1.0 });
    playerPhysics.current = { collider, controller, rigidBody };
  }, [game.level, game.playerIds, start]);

  useEffect(() => {
    if (game.stage === "playing" && play) {
      startTime.current = Rune.gameTime();
      const interval = setInterval(() => {
        if (world.current && playerPhysics.current) {
          const time = Rune.gameTime();
          const isJumping = Boolean(
            jump.current && time - jump.current < maxJumpTime,
          );
          if (isJumping) {
            // Old the jump to jump higher
            jumpVelocity.current = -jumpForce;
          } else {
            // After maxJumpTime add gravity to the velocity vector for smooth curve jump
            jumpVelocity.current +=
              (gravity.y * (time - lastTime.current)) / 1000;
          }
          const position = getPlayerPosition(
            player.current,
            world.current,
            playerPhysics.current,
            isJumping
              ? jumpVelocity.current
              : player.current.grounded
              ? jumpForce
              : jumpVelocity.current,
          );
          setPosition(position);
          let restart = false;
          if (
            position.x < end.x + end.width &&
            position.x + playerWidth > end.x &&
            position.y < end.y + end.height &&
            position.y + playerHeight > end.y
          ) {
            Rune.actions.sendTime({ playerId: yourPlayerId, time: time - startTime.current })
            restart = true;
          } else if (position.y + playerHeight > height) {
            restart = true;
          }
          if (restart) {
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
  }, [end, height, game.stage, play, start, yourPlayerId]);

  useEffect(() => {
    if (countdown) {
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
              className="level__block"
              style={{
                left: block.x,
                top: block.y,
                width: block.width,
                height: block.height,
              }}
            />
          ))}
          <div
            className="level__end"
            style={{
              left: end.x,
              top: end.y,
              width: end.width,
              height: end.height,
            }}
          />
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
