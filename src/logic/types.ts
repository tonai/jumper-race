import type { PlayerId } from "dusk-games-sdk";
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

export interface IGhost extends IPositionWithRotation {
  grounded: boolean;
  movement: IPosition;
  reverse: boolean;
  time: number;
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

export interface IPlayer extends IPositionWithRotation {
  grounded: boolean;
  jumpStartTime: false | number;
  jumpVelocity: number;
  movement: IPosition;
  speed: number;
  wallJump: boolean;
  isWallJumping: boolean;
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

export type Screen = "start" | "customize" | "raceSelect";
export type Stage = "gettingReady" | "countdown" | "playing" | "endOfRound";

export interface GameState {
  countdownTimer: number;
  ghosts: Record<string, IGhost>;
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

export interface IUpdatePositionData extends IGhost {
  playerId: string;
}

export interface ISetBlobColorData {
  color: number;
  playerId: string;
}

export type GameActions = {
  nextRound: () => void;
  sendTime: (data: ISendTimeData) => void;
  setBlobColor: (data: ISetBlobColorData) => void
  startRace: () => void
  updatePosition: (data: IUpdatePositionData) => void;
  voteRace: (data: IVoteRaceData) => void;
};

export type SoundSources = Record<string, string | string[]>

export interface ISoundInstances {
  instances : HTMLAudioElement[];
  source:string;
}

export type SoundInstances = Record<string, ISoundInstances | ISoundInstances[]>

declare module "@dimforge/rapier2d-compat" {
  export interface Collider {
    userData?: IRectangle;
  }
}

export interface Persisted {
  color?: number;
  bestTimes?: Record<string, number>
}
