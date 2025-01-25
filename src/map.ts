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

export const obstacleList = (): Obstacle[] => {
   for (let y = 0; y < obstacles.length; y++) {
      for (let x = 0; x < obstacles[y].length; x++) {
         if (obstacles[y][x] === 'b') {
            return [{ pos: { x: x, y: y }, health: 1 }];
         }
      }
   }
   return [];
};
