import { ColliderDesc, RigidBodyDesc, World } from "@dimforge/rapier2d";

import {
  gravity,
  physicsRatio,
  playerHeight,
  playerOffset,
  playerWidth,
  updatesPerSecond,
} from "../logic/config";
import { ILevel } from "../logic/types";
import { MutableRefObject } from "react";

export function initWorld(level: ILevel, worldRef: MutableRefObject<World | undefined>) {
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
    ); /*.setCollisionGroups(
      2 ** 16 + 2 ** 17 + 2 ** 18 + 2 ** 19 + 2 ** 20 + 2 ** 21 + 63,
    )*/
    const collider = world?.createCollider(colliderDesc, rigidBody);
    collider.userData = block;
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
  const rigidBody = world?.createRigidBody(rigidBodyDesc);
  // const colliderDesc = ColliderDesc.capsule(
  //   playerHeight / 4 / physicsRatio,
  //   playerWidth / 2 / physicsRatio,
  // );
  const colliderDesc = ColliderDesc.cuboid(
    playerWidth / 2 / physicsRatio,
    playerHeight / 2 / physicsRatio,
  ); /*.setCollisionGroups(2 ** (16 + i) + i + 1)*/
  const collider = world?.createCollider(colliderDesc, rigidBody);
  const controller = world?.createCharacterController(playerOffset);
  // controller.setApplyImpulsesToDynamicBodies(true);
  // controller.enableSnapToGround(playerOffset);
  // controller.setCharacterMass(1);
  controller.setUp({ x: 0.0, y: -1.0 });

  worldRef.current = world;
  return { collider, controller, rigidBody };
}
