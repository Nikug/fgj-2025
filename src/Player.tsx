import { forwardRef, useEffect } from 'react';
import {
   Player as PlayerType,
   Action,
   GamePhase,
   V2,
   Direction,
} from './types';
import { PlayerModel } from './Vilperi';
import { useMasterState } from './states/MasterState';
import { sleep } from './sleep';
import { cols, rows } from './App';

interface Props {
   player: PlayerType;
}

export const Player = forwardRef<HTMLDivElement | null, Props>(
   (props, ref) => {
      const { player } = props;
      const playerTurn = useMasterState(state => state.playerTurn);
      const qAction = useMasterState(state => state.queueueueAction);
      const waitingAction = useMasterState(
         state => state.waitingAction,
      );
      const setWaitingAction = useMasterState(
         state => state.setWaitingAction,
      );
      const allowKeyboard =
         useMasterState(state => state.gamePhase) ===
         GamePhase.Planning;

      const isOwnTurn = player.id === playerTurn;

      useEffect(() => {
         const handleKeyDown = (e: KeyboardEvent) => {
            if (playerTurn !== player.id) return;
            if (!allowKeyboard) return;

            const { pos } = player;
            const newPos = { ...pos };
            const newQueueueueueueueueueudActions: Action[] = [];
            let newWaitingAction = waitingAction;
            if (e.key === 'ArrowUp') {
               if (waitingAction) {
                  newQueueueueueueueueueudActions.push(
                     Action.AttackUp,
                  );
                  newWaitingAction = false;
               } else {
                  newPos.y -= 1;
                  newQueueueueueueueueueudActions.push(
                     Action.MoveUp,
                  );
               }
            }
            if (e.key === 'ArrowDown') {
               if (waitingAction) {
                  newQueueueueueueueueueudActions.push(
                     Action.AttackDown,
                  );
                  newWaitingAction = false;
               } else {
                  newPos.y += 1;
                  newQueueueueueueueueueudActions.push(
                     Action.MoveDown,
                  );
               }
            }
            if (e.key === 'ArrowLeft') {
               if (waitingAction) {
                  newQueueueueueueueueueudActions.push(
                     Action.AttackLeft,
                  );
                  newWaitingAction = false;
               } else {
                  newPos.x -= 1;
                  newQueueueueueueueueueudActions.push(
                     Action.MoveLeft,
                  );
               }
            }
            if (e.key === 'ArrowRight') {
               if (waitingAction) {
                  newQueueueueueueueueueudActions.push(
                     Action.AttackRight,
                  );
                  newWaitingAction = false;
               } else {
                  newPos.x += 1;
                  newQueueueueueueueueueudActions.push(
                     Action.MoveRight,
                  );
               }
            }
            if (e.key === ' ' || e.key === 'b' || e.key == 'B') {
               e.preventDefault();
               e.stopPropagation();
               setWaitingAction(true);
            } else {
               qAction(
                  player.id,
                  newQueueueueueueueueueudActions,
                  newWaitingAction,
               );
            }
         };

         addEventListener('keydown', handleKeyDown);

         // Trigger AI action if it's the AI player's turn
         if (
            player.isAI &&
            playerTurn !== player.id &&
            allowKeyboard
         ) {
            console.log('AI should move now!');
            makeAIMoves(5);
         }

         return () => removeEventListener('keydown', handleKeyDown);
      }, [player.pos, playerTurn, waitingAction, allowKeyboard]);

      return (
         <PlayerModel
            ref={ref}
            id={player.elementId}
            model={player.mode}
            color={player.color}
            highlight={isOwnTurn}
         />
      );
   },
);

const AIPlayerLogic = async () => {
   const state = useMasterState.getState();
   const activePlayer = state.activePlayer();

   if (!activePlayer) {
      console.log('No active player for the AI.');
      return;
   }

   console.log(
      `AI is taking its turn: Player ID ${activePlayer.id}`,
   );

   const { players, hasObstacle, queueueueAction, actionsPerTurn } =
      state;

   const enemyPlayers = players.filter(
      player => player.id !== activePlayer.id,
   );

   console.log(`Enemy players found: ${enemyPlayers.length}`);

   // Utility functions
   const isPositionValid = (pos: V2) =>
      pos.x >= 0 &&
      pos.y >= 0 &&
      pos.x < cols &&
      pos.y < rows &&
      !hasObstacle(pos) &&
      !enemyPlayers.some(
         p => p.pos.x === pos.x && p.pos.y === pos.y,
      );

   console.log('Checking position validity...');

   const getDistance = (pos1: V2, pos2: V2) =>
      Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);

   console.log('Distance function defined.');

   const findClosestEnemy = () =>
      enemyPlayers.reduce<{
         player: PlayerType | null;
         distance: number;
      }>(
         (
            closest: { player: PlayerType | null; distance: number },
            enemy,
         ) => {
            const distance = getDistance(
               activePlayer.pos,
               enemy.pos,
            );
            console.log(
               `Distance to enemy ${enemy.id}: ${distance}`,
            );
            return distance < closest.distance
               ? { player: enemy, distance }
               : closest;
         },
         { player: null, distance: Infinity },
      ).player;

   console.log('Find closest enemy function defined.');

   // Decision-making
   const actions: Action[] = [];
   let actionsUsed = 0;

   // 1. Try to attack if an enemy is in range
   const attackDirection = (enemyPos: V2): Direction | null => {
      const dx = enemyPos.x - activePlayer.pos.x;
      const dy = enemyPos.y - activePlayer.pos.y;

      console.log(`Attempting to attack: dx=${dx}, dy=${dy}`);

      if (actions.length === 4 || Math.random() < 0.2) {
         const directions: Direction[] = [
            'ltr',
            'rtl',
            'ttb',
            'btt',
         ];
         const randomDirection =
            directions[
               Math.floor(Math.random() * directions.length)
            ];
         console.log(
            `Random attack direction chosen: ${randomDirection}`,
         );
         return randomDirection;
      }

      if (dx === 1 && dy === 0) return 'ltr';
      if (dx === -1 && dy === 0) return 'rtl';
      if (dx === 0 && dy === 1) return 'ttb';
      if (dx === 0 && dy === -1) return 'btt';

      return null;
   };

   const closestEnemy = findClosestEnemy();
   if (closestEnemy) {
      console.log(
         `Closest enemy found: Player ID ${closestEnemy.id}`,
      );
      const direction = attackDirection(closestEnemy.pos);
      if (direction && actionsUsed < actionsPerTurn) {
         const vammaDirection = {
            rtl: Action.AttackLeft,
            ltr: Action.AttackRight,
            btt: Action.AttackUp,
            ttb: Action.AttackDown,
         }[direction];

         actions.push(vammaDirection);

         actionsUsed++;
         console.log(`AI attacks in direction: ${direction}`);
      } else {
         console.log(
            'No valid attack direction or max actions used.',
         );
      }
   } else {
      console.log('No closest enemy found.');
   }

   // 2. If no attack, move toward the closest enemy
   if (actionsUsed < actionsPerTurn && closestEnemy) {
      console.log('Attempting to move towards closest enemy.');

      const moveDirection = (): Direction | null => {
         const dx = closestEnemy.pos.x - activePlayer.pos.x;
         const dy = closestEnemy.pos.y - activePlayer.pos.y;

         console.log(`Movement check: dx=${dx}, dy=${dy}`);

         if (Math.abs(dx) > Math.abs(dy)) {
            const newPos = {
               x: activePlayer.pos.x + Math.sign(dx),
               y: activePlayer.pos.y,
            };
            console.log(
               `Checking horizontal move to position: ${newPos.x}, ${newPos.y}`,
            );
            if (isPositionValid(newPos)) {
               return dx > 0 ? 'ltr' : 'rtl';
            } else {
               console.log('Invalid horizontal move position.');
            }
         } else {
            const newPos = {
               x: activePlayer.pos.x,
               y: activePlayer.pos.y + Math.sign(dy),
            };
            console.log(
               `Checking vertical move to position: ${newPos.x}, ${newPos.y}`,
            );
            if (isPositionValid(newPos)) {
               return dy > 0 ? 'ttb' : 'btt';
            } else {
               console.log('Invalid vertical move position.');
            }
         }

         // Try all directions to find a valid move
         const directions: Direction[] = [
            'ltr',
            'rtl',
            'ttb',
            'btt',
         ];
         for (const dir of directions) {
            const newPos = {
               x:
                  activePlayer.pos.x +
                  (dir === 'ltr' ? 1 : dir === 'rtl' ? -1 : 0),
               y:
                  activePlayer.pos.y +
                  (dir === 'ttb' ? 1 : dir === 'btt' ? -1 : 0),
            };
            if (isPositionValid(newPos)) {
               return dir;
            }
         }

         // Try to find a direction with an obstacle and move there
         const moveToObstacle = (): Direction | null => {
            const directions: Direction[] = [
               'ltr',
               'rtl',
               'ttb',
               'btt',
            ];
            for (const dir of directions) {
               const newPos = {
                  x:
                     activePlayer.pos.x +
                     (dir === 'ltr' ? 1 : dir === 'rtl' ? -1 : 0),
                  y:
                     activePlayer.pos.y +
                     (dir === 'ttb' ? 1 : dir === 'btt' ? -1 : 0),
               };
               if (hasObstacle(newPos)) {
                  return dir;
               }
            }
            return null;
         };

         const obstacleDirection = moveToObstacle();
         if (obstacleDirection) {
            const vammaDirection = {
               rtl: Action.MoveLeft,
               ltr: Action.MoveRight,
               btt: Action.MoveUp,
               ttb: Action.MoveDown,
            }[obstacleDirection];
            actions.push(vammaDirection);
            actionsUsed++;
            console.log(
               `AI moves towards obstacle in direction: ${obstacleDirection}`,
            );
         }

         return null;
      };

      const direction = moveDirection();
      if (direction) {
         const vammaDirection = {
            rtl: Action.MoveLeft,
            ltr: Action.MoveRight,
            btt: Action.MoveUp,
            ttb: Action.MoveDown,
         }[direction];
         actions.push(vammaDirection);
         actionsUsed++;
         console.log(`AI moves in direction: ${direction}`);
      } else {
         console.log('No valid move direction.');
      }
   } else {
      console.log('No valid move needed or max actions used.');
   }

   // 3. Queue the AI's actions
   if (actions.length > 0) {
      queueueueAction(activePlayer.id, actions, false);
      console.log(`AI queued ${actions.length} actions.`);
   } else {
      console.log('AI has no valid actions this turn.');
   }
};

// Run the AI logic periodically during the game phase
const runAI = () => {
   const state = useMasterState.getState();

   console.log('Checking if AI turn should run...');
   if (state.gamePhase === GamePhase.Planning && state.playerTurn) {
      const activePlayer = state.activePlayer();
      if (activePlayer && activePlayer.isAI) {
         console.log('AI is active, running AI logic...');
         AIPlayerLogic();
      } else {
         console.log('No active AI player or not AI turn.');
      }
   } else {
      console.log('Game phase is not Planning or not player turn.');
   }
};

const makeAIMoves = async (times: number) => {
   console.log(`Making ${times} AI moves.`);
   for (let i = 0; i < times; i++) {
      console.log(`Move ${i + 1} of ${times}`);
      await sleep(1000);
      runAI();
      await sleep(1000);
   }
};
