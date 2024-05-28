import type { World } from "@dimforge/rapier2d-compat";

import {
  gravity,
  physicsRatio,
  playerHeight,
  playerOffset,
  playerSpeed,
  playerWidth,
  updatesPerSecond,
} from "../logic/config";
import { BlockType, ILevel, IPlayer, IPlayerPhysics } from "../logic/types";
import { MutableRefObject } from "react";

export function initWorld(
  rapier: typeof import("@dimforge/rapier2d-compat/rapier"),
  level: ILevel,
  worldRef: MutableRefObject<World | undefined>,
  playerId: string
) {
  const { ColliderDesc, RigidBodyDesc, World } = rapier;
  const { start } = level;

  // World physics
  const world = new World(gravity);
  world.timestep = 1 / updatesPerSecond;
  level.blocks.forEach((block) => {
    const rigidBodyDesc = RigidBodyDesc.fixed().setTranslation(
      (block.x + block.width / 2) / physicsRatio,
      (block.y + block.height / 2) / physicsRatio,
    );
    const rigidBody = world?.createRigidBody(rigidBodyDesc);
    // rigidBody.userData = block.type;
    const colliderDesc = ColliderDesc.cuboid(
      block.width / 2 / physicsRatio,
      block.height / 2 / physicsRatio,
    );
    if (block.type === BlockType.WallJump) {
      // colliderDesc.setCollisionGroups(2 ** 17 + 2 ** 1);
      colliderDesc.setSolverGroups(2 ** 17 + 2 ** 1);
    } else {
      // colliderDesc.setCollisionGroups(2 ** 16 + 2 ** 0);
      colliderDesc.setSolverGroups(2 ** 16 + 2 ** 0);
    }
    const collider = world?.createCollider(colliderDesc, rigidBody);
    collider.userData = block;
  });

  // Player physics
  const rigidBodyDesc = RigidBodyDesc.kinematicPositionBased().setTranslation(
    (start.x + playerWidth / 2) / physicsRatio,
    (start.y + playerHeight / 2) / physicsRatio,
  );
  const rigidBody = world?.createRigidBody(rigidBodyDesc);
  const colliderDesc = ColliderDesc.cuboid(
    playerWidth / 2 / physicsRatio,
    playerHeight / 2 / physicsRatio,
  );
  const collider = world?.createCollider(colliderDesc, rigidBody);
  const controller = world?.createCharacterController(playerOffset);
  controller.setUp({ x: 0.0, y: -1.0 });
  collider.userData = playerId;

  worldRef.current = world;
  return { collider, controller, rigidBody };
}

export function initGhosts(
  rapier: typeof import("@dimforge/rapier2d-compat/rapier"),
  world: World,
  level: ILevel,
  playerIds: string[],
  ghostsPhysics: Record<string, IPlayerPhysics>,
  ghosts: MutableRefObject<Record<string, IPlayer>>,
) {
  const { ColliderDesc, RigidBodyDesc } = rapier;
  const { start } = level;

  // Ghost physics
  return Object.fromEntries(
    playerIds.map((playerId) => {
      if (playerId in ghostsPhysics) {
        return [playerId, ghostsPhysics[playerId]];
      }

      const rigidBodyDesc =
        RigidBodyDesc.kinematicPositionBased().setTranslation(
          (start.x + playerWidth / 2) / physicsRatio,
          (start.y + playerHeight / 2) / physicsRatio,
        );
      const rigidBody = world?.createRigidBody(rigidBodyDesc);
      const colliderDesc = ColliderDesc.cuboid(
        playerWidth / 2 / physicsRatio,
        playerHeight / 2 / physicsRatio,
      );
      const collider = world?.createCollider(colliderDesc, rigidBody);
      const controller = world?.createCharacterController(playerOffset);
      controller.setUp({ x: 0.0, y: -1.0 });
      collider.userData = playerId;
      ghosts.current[playerId] = {
        ...start,
        jump: false,
        jumpVelocity: 0,
        speed: playerSpeed,
        grounded: true,
        wallJump: false,
      };

      return [playerId, { collider, controller, rigidBody }];
    }),
  );
}
