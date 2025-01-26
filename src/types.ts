export interface V2 {
   x: number;
   y: number;
}

export type Direction = 'ltr' | 'rtl' | 'ttb' | 'btt';
export const enum Action {
   MoveUp, // 0
   MoveDown, // 1
   MoveLeft, // 2
   MoveRight, // 3
   AttackUp, // 4
   AttackDown, // 5
   AttackLeft, // 6
   AttackRight, // 7
   Nothing, // 8
}

export const enum PowerUp {
   PlusOne,
   Lazor,
}

export interface UnlimitedPoweeer {
   id: string;
   type: PowerUp;
   pos: V2;
}

export interface Weapon {
   id: string;
   pos: V2;
   direction: Direction;
   playerId: string;
   type: WeaponType;
}

export interface Player {
   name: string;
   mode: PlayerModelType;
   color: string;
   pos: V2;
   id: string;
   queueueueueuedActions: Action[];
   elementId: string;
   hasLazor: boolean;
   isDead: boolean;
   isAI?: boolean;
   attacksPerTurn: number;
   powerUps: PowerUp[];
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
   Lazor,
}

export const enum GamePhase {
   Planning,
   Action,
   ActionAction,
   NextTurn,
}

export type Obstacle = {
   pos: V2;
   health: number;
};

export const enum WeaponType {
   Taikuloinen,
   Sahuli,
   Bansq,
   Star,
   Lazor,
}
