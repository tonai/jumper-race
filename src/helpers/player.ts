import { World, Vector2 } from "@dimforge/rapier2d";

import { IPlayer, IPlayerPhysics } from "../logic/types.ts";
import {
  physicsRatio,
  playerHeight,
  playerSpeed,
  playerWidth,
} from "../logic/config.ts";

export function getPlayerPosition(
  player: IPlayer,
  world: World,
  playerPhysics: IPlayerPhysics,
  jumpForce: number,
) {
  // playerPhysics.rigidBody.resetForces(true);
  // playerPhysics.rigidBody.addForce({ x: playerSpeed, y: isJumping ? -jumpForce : 0 }, true);
  const position = playerPhysics.rigidBody.translation();
  const movement = new Vector2(
    player.speed / physicsRatio,
    jumpForce / physicsRatio,
  );
  playerPhysics.controller.computeColliderMovement(
    playerPhysics.collider,
    movement,
  );
  player.grounded = playerPhysics.controller.computedGrounded();
  const correctedMovement = playerPhysics.controller.computedMovement();
  playerPhysics.rigidBody.setNextKinematicTranslation({
    x: position.x + correctedMovement.x,
    y: position.y + correctedMovement.y,
  });
  world.step();
  const newPosition = playerPhysics.rigidBody.translation();
  return {
    x: newPosition.x * physicsRatio - playerWidth / 2,
    y: newPosition.y * physicsRatio - playerHeight / 2,
  };
}
