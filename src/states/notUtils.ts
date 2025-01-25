import { randomInt } from '../random';
import { Player, V2, Weapon } from '../types';

export const playerOverlap = (pos: V2, players: Player[]) => {
   return players.some(p => p.pos.x === pos.x && p.pos.y === pos.y);
};

export const weaponOverlap = (pos: V2, weapons: Weapon[]) => {
   return weapons.some(w => w.pos.x === pos.x && w.pos.y === pos.y);
};

export const randomPos = (cols: number, rows: number) => {
   return {
            x: randomInt(0, cols - 1),
            y: randomInt(0, rows - 1),
         }
}

export const oob = (pos: V2, cols: number, rows: number) => {
   return pos.x < 0 || pos.x >= cols || pos.y < 0 || pos.y >= rows;
}
