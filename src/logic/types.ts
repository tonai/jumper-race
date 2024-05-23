import { PlayerId } from "rune-games-sdk";
import {
  Collider,
  KinematicCharacterController,
  RigidBody,
  World,
} from "@dimforge/rapier2d";

export interface IPosition {
  x: number;
  y: number;
}

export interface IRectangle extends IPosition {
  width: number;
  height: number;
}

export interface IPlayer extends IPosition {
  grounded: boolean;
  speed: number;
}

export interface IPlayerPhysics {
  collider: Collider;
  controller: KinematicCharacterController;
  rigidBody: RigidBody;
}

export interface ILevel {
  id: number;
  width: number;
  height: number;
  end: IRectangle;
  start: IPosition;
  blocks: IRectangle[];
  totalTime: number;
}

export interface IScore {
  bestTime?: number;
  points?: number;
  rank?: number;
}

export interface GameState {
  countdownTimer: number;
  level: ILevel;
  playerIds: PlayerId[];
  scores?: Record<string, Record<number, IScore>>;
  stage: "gettingReady" | "countdown" | "playing" | "endOfRound";
  timer: number;
  timerStartedAt: number;
  world?: World;
}

export interface ISendTimeData {
  time: number;
  playerId: string;
}

export type GameActions = {
  sendTime: (data: ISendTimeData) => void;
  setReady: () => void;
};
