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
   AttackUp,
   AttackDown,
   AttackLeft,
   AttackRight,
   Nothing,
}

export const enum PowerUp {
   PlusOne,
   Lazor
}

export interface UnlimitedPoweeer {
   id: string,
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
   isDead: boolean;
   isAI?: boolean;
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
}
