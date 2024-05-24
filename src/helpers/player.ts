import { World, Vector2 } from "@dimforge/rapier2d";

import { BlockType, ILevel, IPlayer, IPlayerPhysics, IPosition } from "../logic/types.ts";
import {
  gravity,
  jumpForce,
  maxJumpTime,
  physicsRatio,
  playerHeight,
  playerWidth,
} from "../logic/config.ts";
import { MutableRefObject } from "react";

export function getPlayerPosition(
  level: ILevel,
  playerId: string,
  time: number,
  lastTime: number,
  startTime: number,
  player: IPlayer,
  world: World,
  playerPhysics: IPlayerPhysics,
  jump: MutableRefObject<false | number>,
  jumpVelocity: MutableRefObject<number>,
): [IPosition, boolean] {
  let restart = false;
  const { collider, controller, rigidBody } = playerPhysics;

  // Jump
  const isJumping = Boolean(jump.current && time - jump.current < maxJumpTime);
  if (!isJumping && player.grounded) {
    // Apply gravity
    jumpVelocity.current = jumpForce;
  } else if (!isJumping) {
    // After maxJumpTime add gravity to the velocity vector for smooth curve jump
    jumpVelocity.current += (gravity.y * (time - lastTime)) / 1000;
  }

  // Player position
  world.step();
  const position = rigidBody.translation();
  const movement = new Vector2(
    player.speed / physicsRatio,
    jumpVelocity.current / physicsRatio,
  );
  controller.computeColliderMovement(collider, movement);
  player.grounded = controller.computedGrounded();
  const correctedMovement = controller.computedMovement();
  rigidBody.setNextKinematicTranslation({
    x: position.x + correctedMovement.x,
    y: position.y + correctedMovement.y,
  });
  const newPosition = rigidBody.translation();

  // Collisions
  for (let i = 0; i < controller.numComputedCollisions(); i++) {
    const collision = controller.computedCollision(i);
    const block = collision?.collider?.userData;
    switch(block?.type) {
      case BlockType.Reverse:
        // Reverse speed
        player.speed = -player.speed;
        break;
      case BlockType.Jump:
        // High jump
        jump.current = time;
        jumpVelocity.current = -(block?.force ?? 10);
        break;
      case BlockType.Spikes:
        // Dead
        restart = true;
        break;
      case BlockType.End:
        // Finish
        Rune.actions.sendTime({
          playerId: playerId,
          time: time - startTime,
        });
        restart = true;
        break;
    }
    if (collision?.normal1.y === 1) {
      // Top collision: stop jumping
      jump.current = false;
      jumpVelocity.current = 0;
    }
  }
  // Fall
  if (newPosition.y + playerHeight > level.height) {
    restart = true;
  }

  return [
    {
      x: newPosition.x * physicsRatio - playerWidth / 2,
      y: newPosition.y * physicsRatio - playerHeight / 2,
    },
    restart,
  ];
}
