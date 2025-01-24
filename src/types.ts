export interface V2 {
   x: number;
   y: number;
}

export const enum Action {
   MoveUp,
   MoveDown,
   MoveLeft,
   MoveRight,
   Attack
}

export interface Player {
   name: string;
   mode: PlayerModelType;
   color: string;
   pos: V2;
   id: string;
   queueueueueuedActions: Action[];
}

export const enum Scene {
   StartMenu,
   Game,
}

export const enum PlayerModelType {
   Monkey,
   Ninja,
   Robot,
   Wizard,
}

export const enum GamePhase {
   Planning,
   Action,
}
