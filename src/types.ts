export interface V2 {
   x: number;
   y: number;
}

export interface Player {
   name: string;
   color: string;
   pos: V2;
   id: string;
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
