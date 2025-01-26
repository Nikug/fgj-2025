import { randomInt } from './random';
import { cols, rows } from './states/MasterState';
import { Obstacle } from './types';

export const obstacles = [
   [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
   [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
   [' ', ' ', 'b', 'b', ' ', ' ', 'b', 'b', ' ', ' '],
   [' ', ' ', 'b', ' ', ' ', ' ', ' ', 'b', ' ', ' '],
   [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
   [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
   [' ', ' ', 'b', ' ', ' ', ' ', ' ', 'b', ' ', ' '],
   [' ', ' ', 'b', 'b', ' ', ' ', 'b', 'b', ' ', ' '],
   [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
   [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
];

export const obstacleList = (randomObs: boolean): Obstacle[] => {
   const results: Obstacle[] = [];
   if (randomObs) {
      for (let y = 0; y < cols; y++) {
         for (let x = 0; x < rows; x++) {
            if (y == 0 || x == 0 || y == cols - 1 || x == rows - 1) continue
            const randommm = randomInt(0, 100)
            if (randommm < 20) {
               results.push({ pos: { x: x, y: y }, health: 1 });
            }
         }
      }
   } else {
      for (let y = 0; y < obstacles.length; y++) {
         for (let x = 0; x < obstacles[y].length; x++) {
            if (obstacles[y][x] === 'b') {
               results.push({ pos: { x: x, y: y }, health: 1 });
            }
         }
      }
   }
   
   return results;
};
