import type { PlayerId } from "rune-games-sdk";
import type {
  Collider,
  KinematicCharacterController,
  RigidBody,
  World,
} from "@dimforge/rapier2d-compat";

export interface IPosition {
  x: number;
  y: number;
}

export interface IPositionWithRotation extends IPosition {
  z: number;
}

export interface IDetail {
  src: string;
  width: number;
  height: number;
  offset?: number;
}

export enum BlockType {
  Reverser,
  Jumper,
  Spikes,
  End,
  WallJump,
}

export interface IRectangle extends IPosition {
  details?: { x: number; detail: number }[];
  direction?: "left" | "right";
  width: number;
  height: number;
  type?: BlockType;
  force?: number;
}

export interface IPlayer extends IPosition {
  grounded: boolean;
  speed: number;
  wallJump: boolean;
}

export interface IPlayerPhysics {
  collider: Collider;
  controller: KinematicCharacterController;
  rigidBody: RigidBody;
}

export interface ILevel {
  id: string;
  width: number;
  height: number;
  start: IPosition;
  blocks: IRectangle[];
  totalTime: number;
}

export interface IScore {
  bestTime?: number;
  points?: number;
  rank?: number;
}

export type Stage = "gettingReady" | "raceSelect" | "countdown" | "playing" | "endOfRound";

export interface GameState {
  countdownTimer: number;
  levelIndex: number;
  mode: string,
  playerIds: PlayerId[];
  raceVotes: Record<string, string>;
  scores?: Record<string, Record<string, IScore>>;
  stage: Stage;
  timer: number;
  timerStartedAt: number;
  world?: World;
}

export interface ISendTimeData {
  time: number;
  playerId: string;
}

export interface IVoteRaceData {
  race: string;
  playerId: string;
}

export type GameActions = {
  nextRound: () => void;
  sendTime: (data: ISendTimeData) => void;
  setReady: () => void;
  startRace: () => void
  voteRace: (data: IVoteRaceData) => void;
};

declare module "@dimforge/rapier2d-compat" {
  export interface Collider {
    userData?: IRectangle;
  }
}
