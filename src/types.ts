export interface V2 {
   x: number;
   y: number;
}

export type Direction = 'ltr' | 'rtl' | 'ttb' | 'btt';
export const enum Action {
   MoveUp,
   MoveDown,
   MoveLeft,
   MoveRight,
   Attack,
}

export interface Weapon {
   id: string;
   pos: V2;
   direction: Direction;
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

export type Obstacle = {
   pos: V2;
   health: number;
};
