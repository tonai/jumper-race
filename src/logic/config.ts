import { BlockType, ILevel } from "./types";

export const gravity = { x: 0.0, y: 20 };
export const updatesPerSecond = 30;
export const countdownDurationSeconds = 3;
export const playerWidth = 32;
export const playerHeight = 32;
export const playerSpeed = 6;
export const playerOffset = 0.01;
export const physicsRatio = 100;
export const jumpForce = 6;
export const maxJumpTime = 300;
export const assetSize = 32;
export const parallax = 8;
export const randomChance = 7;

export const levels: ILevel[] = [
  {
    id: 1,
    width: 1600,
    height: 448,
    start: { x: 16, y: 416 - playerHeight },
    blocks: [
      {
        x: 0,
        width: 1600,
        y: 416,
        height: 32,
        details: [
          { x: 4, detail: 21 },
          { x: 39, detail: 14 },
        ],
      },
      { x: 192, width: 704, y: 384, height: 32 },
      { x: 320, width: 576, y: 352, height: 32 },
      { x: 448, width: 448, y: 320, height: 32 },
      { x: 544, width: 352, y: 256, height: 64 },
      { x: 640, width: 256, y: 192, height: 64 },
      {
        x: 736,
        width: 288,
        y: 128,
        height: 64,
        details: [{ x: 3, detail: 13 }],
      },
      { x: 1152, width: 64, y: 0, height: 288 },
      { x: 1024, width: 192, y: 288, height: 32 },
      { x: 1408, width: 192, y: 160, height: 256 },
      { x: 864, width: 64, y: 112, height: 16, type: BlockType.Spikes },
      {
        x: 1152 - 12,
        width: 16,
        y: 0,
        height: 288,
        type: BlockType.Reverser,
        direction: "left",
      },
      { x: 896 - 4, width: 16, y: 192, height: 224, type: BlockType.Reverser },
      {
        x: 1280,
        width: 64,
        y: 400,
        height: 16,
        type: BlockType.Jumper,
        force: 15,
      },
      {
        x: 1408 - 12,
        width: 16,
        y: 288,
        height: 128,
        type: BlockType.Reverser,
        direction: "left",
      },
      { x: 1536, width: 32, y: 96, height: 64, type: BlockType.End },
    ],
    totalTime: 90,
  },
  {
    id: 2,
    width: 896,
    height: 1280,
    start: { x: 16, y: 1184 - playerHeight },
    blocks: [
      { x: 0, width: 320, y: 1184, height: 32 },
      {
        x: 192,
        width: 64,
        y: 1168,
        height: 16,
        type: BlockType.Jumper,
        force: 13,
      },
      { x: 256, width: 64, y: 992, height: 192 },
      { x: 256, width: 640, y: 960, height: 32 },
      {
        x: 832,
        width: 64,
        y: 704,
        height: 256,
        details: [{ x: 1, detail: 15 }],
      },
      {
        x: 768,
        width: 64,
        y: 944,
        height: 16,
        type: BlockType.Jumper,
        force: 12,
      },
      { x: 832 - 12, width: 16, y: 704, height: 128, type: BlockType.WallJump },
      { x: 576, width: 128, y: 768, height: 32 },
      {
        x: 608,
        width: 64,
        y: 752,
        height: 16,
        type: BlockType.Jumper,
        force: 12,
      },
      { x: 128, width: 320, y: 640, height: 32 },
      {
        x: 128,
        width: 64,
        y: 384,
        height: 256,
        details: [{ x: 1, detail: 19 }],
      },
      {
        x: 192,
        width: 64,
        y: 624,
        height: 16,
        type: BlockType.Jumper,
        force: 12,
      },
      { x: 192 - 4, width: 16, y: 384, height: 128, type: BlockType.WallJump },
      { x: 320, width: 96, y: 448, height: 32 },
      { x: 544, width: 224, y: 448, height: 32 },
      {
        x: 704,
        width: 64,
        y: 192,
        height: 256,
        details: [{ x: 1, detail: 15 }],
      },
      {
        x: 640,
        width: 64,
        y: 432,
        height: 16,
        type: BlockType.Jumper,
        force: 12,
      },
      { x: 704 - 12, width: 16, y: 192, height: 128, type: BlockType.WallJump },
      { x: 256, width: 320, y: 256, height: 32 },
      { x: 256, width: 128, y: 64, height: 192 },
      {
        x: 384,
        width: 64,
        y: 240,
        height: 16,
        type: BlockType.Jumper,
        force: 12,
      },
      { x: 304, width: 32, y: 0, height: 64, type: BlockType.End },
    ],
    totalTime: 90,
  },
];
