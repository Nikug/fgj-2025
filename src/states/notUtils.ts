import { randomInt } from '../random';
import { Player, V2 } from '../types';

export const playerOverlap = (pos: V2, players: Player[]) => {
   return players.some(p => p.pos.x === pos.x && p.pos.y === pos.y);
};

export const randomPos = (cols: number, rows: number) => {
   return {
            x: randomInt(0, cols - 1),
            y: randomInt(0, rows - 1),
         }
}