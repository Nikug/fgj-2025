import { Player, V2 } from '../types';

export const playerOverlap = (pos: V2, players: Player[]) => {
   return players.some(p => p.pos.x === pos.x && p.pos.y === pos.y);
};
