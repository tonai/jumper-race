import { BlockType, ILevel } from "./types";

export const gravity = { x: 0.0, y: 20 };
export const updatesPerSecond = 30;
export const countdownDurationSeconds = 3;
export const playerWidth = 10;
export const playerHeight = 20;
export const playerSpeed = 4;
export const playerOffset = 0.01;
export const physicsRatio = 100;
export const jumpForce = 4;
export const maxJumpTime = 300;

export const levels: ILevel[] = [
  {
    id: 1,
    width: 1200,
    height: 200,
    start: { x: 10, y: 180 - playerHeight },
    blocks: [
      { x: 0, width: 1200, y: 180, height: 20 },
      { x: 200, width: 500, y: 160, height: 20 },
      { x: 300, width: 400, y: 140, height: 20 },
      { x: 400, width: 300, y: 120, height: 20 },
      { x: 450, width: 250, y: 90, height: 30 },
      { x: 500, width: 200, y: 60, height: 30 },
      { x: 550, width: 250, y: 30, height: 30 },
      { x: 900, width: 50, y: 0, height: 130 },
      { x: 800, width: 100, y: 100, height: 30 },
      { x: 1100, width: 100, y: 30, height: 150 },
      { x: 650, width: 50, y: 25, height: 5, type: BlockType.Spikes },
      { x: 895, width: 5, y: 50, height: 50, type: BlockType.Reverser },
      { x: 700, width: 5, y: 130, height: 50, type: BlockType.Reverser },
      { x: 1000, width: 50, y: 175, height: 5, type: BlockType.Jumper, force: 12 },
      { x: 1095, width: 5, y: 130, height: 50, type: BlockType.Reverser },
      { x: 1165, width: 20, y: -10, height: 40, type: BlockType.End },
    ],
    totalTime: 60,
  },
  {
    id: 2,
    width: 700,
    height: 800,
    start: { x: 10, y: 780 - playerHeight },
    blocks: [
      { x: 0, width: 200, y: 780, height: 20 },
      { x: 150, width: 50, y: 775, height: 5, type: BlockType.Jumper, force: 10 },
      { x: 200, width: 50, y: 650, height: 150 },
      { x: 200, width: 500, y: 630, height: 20 },
      { x: 650, width: 50, y: 430, height: 200 },
      { x: 600, width: 50, y: 625, height: 5, type: BlockType.Jumper, force: 10 },
      { x: 645, width: 5, y: 430, height: 100, type: BlockType.WallJump },
      { x: 450, width: 100, y: 480, height: 20 },
      { x: 100, width: 300, y: 480, height: 20 },
      { x: 100, width: 50, y: 280, height: 200 },
      { x: 150, width: 50, y: 475, height: 5, type: BlockType.Jumper, force: 10 },
      { x: 150, width: 5, y: 280, height: 100, type: BlockType.WallJump },
      { x: 250, width: 100, y: 330, height: 20 },
      { x: 400, width: 200, y: 330, height: 20 },
      { x: 550, width: 50, y: 130, height: 200 },
      { x: 500, width: 50, y: 325, height: 5, type: BlockType.Jumper, force: 10 },
      { x: 545, width: 5, y: 130, height: 100, type: BlockType.WallJump },
      { x: 200, width: 250, y: 180, height: 20 },
      { x: 200, width: 100, y: 30, height: 150 },
      { x: 300, width: 50, y: 175, height: 5, type: BlockType.Jumper, force: 10 },
      { x: 240, width: 20, y: -10, height: 40, type: BlockType.End },
    ],
    totalTime: 60,
  }
];
