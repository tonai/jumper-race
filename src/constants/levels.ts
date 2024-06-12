import { BlockType, ILevel } from "../logic/types";
import { playerHeight, playerWidth } from "./config";

const totalTime = 90;

export const levels: ILevel[] = [
  {
    id: '1',
    width: 1536,
    height: 320,
    start: { x: 16, y: 256 - playerHeight },
    blocks: [
      {
        x: 0,
        width: 320,
        y: 256,
        height: 32,
        details: [{ x: 9, detail: 21 }],
      },
      {
        x: 448,
        width: 320,
        y: 256,
        height: 32,
        details: [{ x: 7, detail: 13 }],
      },
      { x: 704, width: 64, y: 256 - 16, height: 16, type: BlockType.Spikes },
      {
        x: 768,
        width: 320,
        y: 256,
        height: 32,
        details: [{ x: 5, detail: 14 }],
      },
      {
        x: 960,
        width: 64,
        y: 256 - 16,
        height: 16,
        type: BlockType.Jumper,
        force: 15,
      },
      { x: 1024, width: 64, y: 0, height: 256 },
      { x: 1088, width: 448, y: 256, height: 32 },
      { x: 1088, width: 192, y: 0, height: 32 },
      { x: 1472, width: 64, y: 0, height: 256 },
      {
        x: 1472 - 12,
        width: 16,
        y: 0,
        height: 256,
        type: BlockType.Reverser,
        direction: "left",
      },
      { x: 1120, width: 32, y: 192, height: 64, type: BlockType.End },
    ],
    totalTime,
  },
  {
    id: '2',
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
    totalTime,
  },
  {
    id: '3',
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
    totalTime,
  },
  {
    id: '4',
    width: 1600,
    height: 640,
    start: { x: 16, y: 576 - playerHeight },
    blocks: [
      {
        x: 0,
        width: 64,
        y: 576,
        height: 64,
      },
      {
        x: 64,
        width: 128,
        y: 608,
        height: 32,
      },
      { x: 64, width: 128, y: 608 - 16, height: 16, type: BlockType.Spikes },
      {
        x: 192,
        width: 192,
        y: 544,
        height: 96,
      },
      {
        x: 320,
        width: 64,
        y: 544 - 16,
        height: 16,
        type: BlockType.Jumper,
        force: 15,
      },
      {
        x: 384,
        width: 192,
        y: 288,
        height: 352,
      },
      {
        x: 640,
        width: 32,
        y: 160,
        height: 256,
      },
      {
        x: 576,
        width: 256,
        y: 576,
        height: 64,
      },
      {
        x: 832,
        width: 128,
        y: 608,
        height: 32,
      },
      { x: 832, width: 128, y: 608 - 16, height: 16, type: BlockType.Spikes },
      {
        x: 960,
        width: 96,
        y: 576,
        height: 64,
      },
      {
        x: 1056,
        width: 128,
        y: 608,
        height: 32,
      },
      { x: 1056, width: 128, y: 608 - 16, height: 16, type: BlockType.Spikes },
      {
        x: 1184,
        width: 256,
        y: 576,
        height: 64,
      },
      {
        x: 1440,
        width: 160,
        y: 416,
        height: 224,
      },
      { x: 1440 - 12, width: 16, y: 416, height: 160, type: BlockType.WallJump },
      {
        x: 1312,
        width: 32,
        y: 320,
        height: 160,
      },
      { x: 1344 - 4, width: 16, y: 320, height: 160, type: BlockType.WallJump },
      {
        x: 1472,
        width: 64,
        y: 416 - 16,
        height: 16,
        type: BlockType.Jumper,
        force: 15,
      },
      {
        x: 1536,
        width: 64,
        y: 0,
        height: 416,
      },
      { x: 1536 - 12, width: 16, y: 0, height: 160, type: BlockType.WallJump },
      {
        x: 1280,
        width: 128,
        y: 128,
        height: 32,
      },
      { x: 1296, width: 32, y: 128-64, height: 64, type: BlockType.End },
    ],
    totalTime,
  },
  {
    
    id: '5',
    width: 1440,
    height: 640,
    start: { x: 416 - playerWidth / 2, y: 416 - playerHeight },
    blocks: [
      {
        x: 320,
        width: 128,
        y: 416,
        height: 32,
      },
      {
        x: 320,
        width: 32,
        y: 288,
        height: 128,
      },
      {
        x: 352 - 4,
        width: 16,
        y: 288,
        height: 128,
        type: BlockType.Reverser,
        direction: "right",
      },
      {
        x: 576,
        width: 128,
        y: 416,
        height: 32,
      },
      {
        x: 704,
        width: 64,
        y: 288,
        height: 160,
      },
      {
        x: 704 - 12,
        width: 16,
        y: 320,
        height: 96,
        type: BlockType.Reverser,
        direction: "left",
      },
      {
        x: 576,
        width: 64,
        y: 448,
        height: 192,
      },
      {
        x: 512,
        width: 64,
        y: 608,
        height: 32,
      },
      { x: 512, width: 64, y: 608 - 16, height: 16, type: BlockType.Spikes },
      {
        x: 192,
        width: 320,
        y: 576,
        height: 64,
      },
      {
        x: 192,
        width: 64,
        y: 576 - 16,
        height: 16,
        type: BlockType.Jumper,
        force: 15,
      },
      {
        x: 64,
        width: 128,
        y: 320,
        height: 320,
      },
      {
        x: 0,
        width: 64,
        y: 64,
        height: 576,
      },
      { x: 64 - 4, width: 16, y: 64, height: 192, type: BlockType.WallJump },
      {
        x: 192,
        width: 128,
        y: 192,
        height: 32,
      },
      {
        x: 416,
        width: 128,
        y: 160,
        height: 32,
      },
      {
        x: 768,
        width: 64,
        y: 288,
        height: 128,
      },
      {
        x: 768,
        width: 64,
        y: 288 - 16,
        height: 16,
        type: BlockType.Jumper,
        force: 15,
      },
      {
        x: 832,
        width: 64,
        y: 32,
        height: 384,
      },
      {
        x: 896,
        width: 128,
        y: 32,
        height: 64,
      },
      {
        x: 1024,
        width: 64,
        y: 64,
        height: 32,
      },
      { x: 1024, width: 64, y: 64 - 16, height: 16, type: BlockType.Spikes },
      {
        x: 1088,
        width: 64,
        y: 32,
        height: 64,
      },
      {
        x: 1376,
        width: 64,
        y: 0,
        height: 416,
      },
      {
        x: 1376 - 12,
        width: 16,
        y: 0,
        height: 352,
        type: BlockType.Reverser,
        direction: "left",
      },
      {
        x: 1152,
        width: 224,
        y: 352,
        height: 64,
      },
      {
        x: 1056,
        width: 96,
        y: 384,
        height: 32,
      },
      { x: 1056, width: 96, y: 384 - 16, height: 16, type: BlockType.Spikes },
      {
        x: 896,
        width: 160,
        y: 352,
        height: 64,
      },
      { x: 896 - 4, width: 16, y: 96, height: 192, type: BlockType.WallJump },
      {
        x: 1024,
        width: 128,
        y: 224,
        height: 32,
      },
      { x: 1088 - 16, width: 32, y: 224-64, height: 64, type: BlockType.End },
    ],
    totalTime,
  }
];