import type { World } from "@dimforge/rapier2d-compat";

import {
  gravity,
  physicsRatio,
  playerHeight,
  playerOffset,
  playerWidth,
  updatesPerSecond,
} from "../constants/config";
import { BlockType, ILevel } from "../logic/types";
import { MutableRefObject } from "react";

export function initWorld(
  rapier: typeof import("@dimforge/rapier2d-compat/rapier"),
  level: ILevel,
  worldRef: MutableRefObject<World | undefined>
) {
  const { ColliderDesc, RigidBodyDesc, World } = rapier;
  const { start } = level;

  // World physics
  const world = new World(gravity);
  world.timestep = 1 / updatesPerSecond;
  level.blocks.forEach((block) => {
    const rigidBodyDesc = RigidBodyDesc.fixed().setTranslation(
      (block.x + block.width / 2) / physicsRatio,
      (block.y + block.height / 2) / physicsRatio
    );
    const rigidBody = world?.createRigidBody(rigidBodyDesc);
    // rigidBody.userData = block.type;
    const colliderDesc = ColliderDesc.cuboid(
      block.width / 2 / physicsRatio,
      block.height / 2 / physicsRatio
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
    (start.y + playerHeight / 2) / physicsRatio
  );
  // const rigidBodyDesc = RigidBodyDesc.dynamic().setTranslation(
  //   (start.x + playerWidth / 2) / physicsRatio,
  //   (start.y + playerHeight / 2) / physicsRatio,
  // );
  const rigidBody = world?.createRigidBody(rigidBodyDesc);
  // const colliderDesc = ColliderDesc.capsule(
  //   playerHeight / 4 / physicsRatio,
  //   playerWidth / 2 / physicsRatio,
  // );
  const colliderDesc = ColliderDesc.cuboid(
    playerWidth / 2 / physicsRatio,
    playerHeight / 2 / physicsRatio
  );
  const collider = world?.createCollider(colliderDesc, rigidBody);
  const controller = world?.createCharacterController(playerOffset);
  // controller.setApplyImpulsesToDynamicBodies(true);
  // controller.enableSnapToGround(playerOffset);
  // controller.setCharacterMass(1);
  controller.setUp({ x: 0.0, y: -1.0 });

  worldRef.current = world;
  return { collider, controller, rigidBody };
}
