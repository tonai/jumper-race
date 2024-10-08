import type { Collider, World } from "@dimforge/rapier2d-compat"

import {
  BlockType,
  ILevel,
  IPlayer,
  IPlayerPhysics,
  IPositionWithRotation,
} from "../logic/types.ts"
import {
  gravity,
  jumpForce,
  maxJumpTime,
  physicsRatio,
  playerHeight,
  playerWidth,
} from "../constants/config.ts"
import { playSound } from "./sounds.ts"

export const radianOffset = (90 * Math.PI) / 180

export function getPlayerPosition(
  rapier: typeof import("@dimforge/rapier2d-compat/rapier"),
  level: ILevel,
  playerId: string,
  time: number,
  lastTime: number,
  startTime: number,
  player: IPlayer,
  world: World,
  playerPhysics: IPlayerPhysics,
  playerRef: HTMLDivElement | null,
  volume: number | null,
  setRaceTime: (time: number) => void,
  playerBest: number,
  overallBest: number
): [IPositionWithRotation, boolean] {
  const { Vector2 } = rapier
  let restart: false | "dead" | "finish" = false
  const { collider, controller, rigidBody } = playerPhysics

  // Jump
  const isJumping = Boolean(
    player.jumpStartTime && time - player.jumpStartTime < maxJumpTime
  )
  if (!isJumping && player.grounded) {
    // Apply gravity
    player.jumpVelocity = jumpForce
  } else if (!isJumping) {
    // After maxJumpTime add gravity to the velocity vector for smooth curve jump
    if (player.wallJump && player.jumpVelocity > 0) {
      player.jumpVelocity += ((gravity.y / 4) * (time - lastTime)) / 1000
    } else {
      player.jumpVelocity += (gravity.y * (time - lastTime)) / 1000
    }
  }

  // Player position
  world.step()
  const position = rigidBody.translation()
  const movement = new Vector2(
    player.grounded ? 0 : player.speed / physicsRatio,
    player.jumpVelocity / physicsRatio
  )
  let isCollidingWallJump = false
  controller.computeColliderMovement(
    collider,
    movement,
    undefined,
    undefined,
    (collider: Collider) => {
      isCollidingWallJump =
        isCollidingWallJump || collider.userData?.type === BlockType.WallJump
      return collider.userData?.type !== BlockType.WallJump
    }
  )
  player.wallJump = isCollidingWallJump && !player.isWallJumping
  player.isWallJumping = player.isWallJumping && isCollidingWallJump
  player.grounded = controller.computedGrounded()
  const correctedMovement = controller.computedMovement()
  rigidBody.setNextKinematicTranslation({
    x: position.x + correctedMovement.x,
    y: position.y + correctedMovement.y,
  })
  let z = 0
  if (!player.grounded) {
    const angle =
      (Math.atan(correctedMovement.y / correctedMovement.x) * 180) / Math.PI
    if (angle < 80 && angle > -80) {
      z = Math.min(Math.max(angle, -20), 20)
    }
  }
  const newPosition = rigidBody.translation()

  // Collisions
  for (let i = 0; i < controller.numComputedCollisions(); i++) {
    const collision = controller.computedCollision(i)
    const block = collision?.collider?.userData
    switch (block?.type) {
      case BlockType.Reverser:
        // Reverse speed
        player.speed =
          (block?.direction === "left" ? -1 : 1) * Math.abs(player.speed)
        if (player.speed < 0) {
          playerRef?.classList.add("reverse")
        } else {
          playerRef?.classList.remove("reverse")
        }
        playSound("walljump", volume)
        break
      case BlockType.Jumper:
        // High jump
        player.jumpStartTime = time
        player.jumpVelocity = -(block?.force ?? 10)
        playSound("jumper", volume)
        break
      case BlockType.Spikes:
        // Dead
        restart = "dead"
        break
      case BlockType.End: {
        // Finish
        const raceTime = time - startTime
        Rune.actions.sendTime({
          playerId: playerId,
          time: raceTime,
        })
        setRaceTime(raceTime)
        restart = "finish"
        if (raceTime <= overallBest) {
          playSound("endBest", volume)
        } else if (raceTime <= playerBest) {
          playSound("endGood", volume)
        } else {
          playSound("endBad", volume) // TODO
        }
        break
      }
    }
    if (collision?.normal1.y === 1) {
      // Top collision: stop jumping
      player.jumpStartTime = false
      player.jumpVelocity = 0
    }
  }

  const playerPosition = {
    x: newPosition.x * physicsRatio - playerWidth / 2,
    y: newPosition.y * physicsRatio - playerHeight / 2,
    z,
  }
  player.x = playerPosition.x
  player.y = playerPosition.y
  player.z = playerPosition.z
  player.movement = {
    x: correctedMovement.x * physicsRatio,
    y: correctedMovement.y * physicsRatio,
  }

  // Fall
  if (playerPosition.y + playerHeight > level.height) {
    restart = "dead"
  }
  if (restart === "dead") {
    document.body.classList.add("shake")
    setTimeout(() => document.body.classList.remove("shake"), 500)
    playSound("spikes", volume)
  }

  return [playerPosition, Boolean(restart)]
}
