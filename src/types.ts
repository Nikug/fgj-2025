export interface V2 {
   x: number;
   y: number;
}

export interface Player {
   name: string;
   color: string;
   pos: V2;
   id: number;
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

