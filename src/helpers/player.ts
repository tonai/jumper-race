import { World, Vector2, Collider } from "@dimforge/rapier2d";

import {
  BlockType,
  ILevel,
  IPlayer,
  IPlayerPhysics,
  IPositionWithRotation,
} from "../logic/types.ts";
import {
  gravity,
  jumpForce,
  maxJumpTime,
  physicsRatio,
  playerHeight,
  playerWidth,
} from "../logic/config.ts";
import { MutableRefObject } from "react";
import { playSound } from "./sounds.ts";

export const radianOffset = (90 * Math.PI) / 180;

export function getPlayerPosition(
  level: ILevel,
  playerId: string,
  time: number,
  lastTime: number,
  startTime: number,
  player: IPlayer,
  world: World,
  playerPhysics: IPlayerPhysics,
  playerRef: HTMLDivElement | null,
  jump: MutableRefObject<false | number>,
  jumpVelocity: MutableRefObject<number>
): [IPositionWithRotation, boolean] {
  let restart = false;
  const { collider, controller, rigidBody } = playerPhysics;

  // Jump
  const isJumping = Boolean(jump.current && time - jump.current < maxJumpTime);
  if (!isJumping && player.grounded) {
    // Apply gravity
    jumpVelocity.current = jumpForce;
  } else if (!isJumping) {
    // After maxJumpTime add gravity to the velocity vector for smooth curve jump
    if (player.wallJump && jumpVelocity.current > 0) {
      jumpVelocity.current += ((gravity.y / 4) * (time - lastTime)) / 1000;
    } else {
      jumpVelocity.current += (gravity.y * (time - lastTime)) / 1000;
    }
  }

  // Player position
  world.step();
  const position = rigidBody.translation();
  const movement = new Vector2(
    player.grounded ? 0 : player.speed / physicsRatio,
    jumpVelocity.current / physicsRatio
  );
  let isCollidingWallJump = false;
  controller.computeColliderMovement(
    collider,
    movement,
    undefined,
    undefined,
    (collider: Collider) => {
      isCollidingWallJump =
        isCollidingWallJump || collider.userData?.type === BlockType.WallJump;
      return collider.userData?.type !== BlockType.WallJump;
    }
  );
  player.wallJump = isCollidingWallJump;
  player.grounded = controller.computedGrounded();
  if (player.grounded) {
    playerRef?.classList.remove("level__player--jump");
  }
  const correctedMovement = controller.computedMovement();
  rigidBody.setNextKinematicTranslation({
    x: position.x + correctedMovement.x,
    y: position.y + correctedMovement.y,
  });
  let z = 0;
  if (!player.grounded) {
    const angle =
      (Math.atan(correctedMovement.y / correctedMovement.x) * 180) / Math.PI;
    if (angle < 80 && angle > -80) {
      z = Math.min(Math.max(angle, -20), 20);
    }
  }
  const newPosition = rigidBody.translation();

  // Collisions
  for (let i = 0; i < controller.numComputedCollisions(); i++) {
    const collision = controller.computedCollision(i);
    const block = collision?.collider?.userData;
    switch (block?.type) {
      case BlockType.Reverser:
        // Reverse speed
        player.speed = -player.speed;
        if (player.speed < 0) {
          playerRef?.classList.add("level__player--reverse");
        } else {
          playerRef?.classList.remove("level__player--reverse");
        }
        playSound("walljump");
        break;
      case BlockType.Jumper:
        // High jump
        jump.current = time;
        jumpVelocity.current = -(block?.force ?? 10);
        playSound("jumper");
        break;
      case BlockType.Spikes:
        // Dead
        restart = true;
        playSound("spikes");
        break;
      case BlockType.End:
        // Finish
        Rune.actions.sendTime({
          playerId: playerId,
          time: time - startTime,
        });
        restart = true;
        playSound("end");
        break;
    }
    if (collision?.normal1.y === 1) {
      // Top collision: stop jumping
      jump.current = false;
      jumpVelocity.current = 0;
    }
  }

  const playerPosition = {
    x: newPosition.x * physicsRatio - playerWidth / 2,
    y: newPosition.y * physicsRatio - playerHeight / 2,
    z,
  };
  // Fall
  if (playerPosition.y + playerHeight > level.height) {
    restart = true;
  }

  return [playerPosition, restart];
}
