import { cols, rows } from '../App';
import { sleep } from '../sleep';
import { useMasterState } from '../states/MasterState';
import {
   Action,
   Direction,
   GamePhase,
   V2,
   Player as PlayerType,
} from '../types';

const getPositionsOfOwnAttacks = (
   initialPos: V2,
   actions: Action[],
): V2[] => {
   const newPos = { ...initialPos };
   let attackPosition = null;
   const attackPositions = [];

   for (const action of actions) {
      switch (action) {
         case Action.MoveUp:
            newPos.y -= 1;
            break;
         case Action.MoveDown:
            newPos.y += 1;
            break;
         case Action.MoveLeft:
            newPos.x -= 1;
            break;
         case Action.MoveRight:
            newPos.x += 1;
            break;
         case Action.AttackUp:
            attackPosition = { ...newPos };
            attackPosition.y -= 1;
            attackPositions.push(attackPosition);
            break;
         case Action.AttackDown:
            attackPosition = { ...newPos };
            attackPosition.y += 1;
            attackPositions.push(attackPosition);
            break;
         case Action.AttackLeft:
            attackPosition = { ...newPos };
            attackPosition.x -= 1;
            attackPositions.push(attackPosition);
            break;
         case Action.AttackRight:
            attackPosition = { ...newPos };
            attackPosition.x += 1;
            attackPositions.push(attackPosition);
            break;
         default:
            break;
      }
   }

   return attackPositions;
};

const getDistance = (pos1: V2, pos2: V2) =>
   Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);

const getPositionAfterActions = (
   initialPos: V2,
   actions: Action[],
): V2 => {
   const newPos = { ...initialPos };

   actions.forEach(action => {
      switch (action) {
         case Action.MoveUp:
            newPos.y -= 1;
            break;
         case Action.MoveDown:
            newPos.y += 1;
            break;
         case Action.MoveLeft:
            newPos.x -= 1;
            break;
         case Action.MoveRight:
            newPos.x += 1;
            break;
         default:
            break;
      }
   });

   return newPos;
};

const getEnemyPlayers = (): PlayerType[] => {
   const state = useMasterState.getState();
   const { players } = state;
   const activePlayer = state.activePlayer();
   return players.filter(player => player.id !== activePlayer?.id);
};

const isPositionValid = (pos: V2, actions: Action[]) => {
   const state = useMasterState.getState();
   const { hasObstacle } = state;
   const activePlayer = state.activePlayer();
   const enemyPlayers = getEnemyPlayers();

   if (!activePlayer) {
      return false;
   }

   const ownActions = getPositionsOfOwnAttacks(
      activePlayer.pos,
      activePlayer.queueueueueuedActions.concat(actions),
   );

   return (
      pos.x >= 0 &&
      pos.y >= 0 &&
      pos.x < cols &&
      pos.y < rows &&
      !hasObstacle(pos) &&
      !enemyPlayers.some(
         p => p.pos.x === pos.x && p.pos.y === pos.y,
      ) &&
      !state.weapons.some(
         w => w.pos.x === pos.x && w.pos.y === pos.y,
      ) &&
      !ownActions.some(a => a.x === pos.x && a.y === pos.y)
   );
};

const findClosestEnemy = (actions: Action[]) => {
   const state = useMasterState.getState();
   const activePlayer = state.activePlayer()!;
   const enemyPlayers = getEnemyPlayers();

   return enemyPlayers.reduce<{
      player: PlayerType | null;
      distance: number;
   }>(
      (
         closest: { player: PlayerType | null; distance: number },
         enemy,
      ) => {
         const currentPosition = getPositionAfterActions(
            activePlayer.pos,
            activePlayer.queueueueueuedActions.concat(actions),
         );
         const distance = getDistance(currentPosition, enemy.pos);
         console.log(`Distance to enemy ${enemy.id}: ${distance}`);
         return distance < closest.distance
            ? { player: enemy, distance }
            : closest;
      },
      { player: null, distance: Infinity },
   ).player;
};

const getAttackAction = (
   enemyPos: V2 | undefined,
   actions: Action[],
): Action | null => {
   if (!enemyPos) {
      return null;
   }

   const state = useMasterState.getState();
   const activePlayer = state.activePlayer()!;
   const currentPosition = getPositionAfterActions(
      activePlayer.pos,
      activePlayer.queueueueueuedActions.concat(actions),
   );
   const dx = enemyPos.x - currentPosition.x;
   const dy = enemyPos.y - currentPosition.y;

   if (dx === 1 && dy === 0)
      return mapDirectionToAttackAction('ltr');
   if (dx === -1 && dy === 0)
      return mapDirectionToAttackAction('rtl');
   if (dx === 0 && dy === 1)
      return mapDirectionToAttackAction('ttb');
   if (dx === 0 && dy === -1)
      return mapDirectionToAttackAction('btt');

   const attackActions = activePlayer.queueueueueuedActions
      .concat(actions)
      .filter(
         action =>
            action === Action.AttackLeft ||
            action === Action.AttackRight ||
            action === Action.AttackUp ||
            action === Action.AttackDown,
      );
   if (
      attackActions.length < activePlayer.attacksPerTurn &&
      (actions.length === 4 || Math.random() < 0.2)
   ) {
      const directions: Direction[] = ['ltr', 'rtl', 'ttb', 'btt'];
      const randomDirection =
         directions[Math.floor(Math.random() * directions.length)];
      return mapDirectionToAttackAction(randomDirection);
   }

   return null;
};

const getAttackActions = (actions: Action[]) => {
   const state = useMasterState.getState();
   const activePlayer = state.activePlayer()!;
   return activePlayer.queueueueueuedActions
      .concat(actions)
      .filter(
         action =>
            action === Action.AttackLeft ||
            action === Action.AttackRight ||
            action === Action.AttackUp ||
            action === Action.AttackDown,
      );
};

const mapDirectionToAttackAction = (direction: Direction) => {
   return {
      rtl: Action.AttackLeft,
      ltr: Action.AttackRight,
      btt: Action.AttackUp,
      ttb: Action.AttackDown,
   }[direction];
};

const mapDirectionToMoveAction = (direction: Direction) => {
   return {
      rtl: Action.MoveLeft,
      ltr: Action.MoveRight,
      btt: Action.MoveUp,
      ttb: Action.MoveDown,
   }[direction];
};

const tryToGetActionToMoveTowardsEnemy = (
   closestEnemy: PlayerType,
   actions: Action[],
) => {
   const state = useMasterState.getState();
   const activePlayer = state.activePlayer()!;
   const currentPosition = getPositionAfterActions(
      activePlayer.pos,
      activePlayer.queueueueueuedActions.concat(actions),
   );
   const dx = closestEnemy.pos.x - currentPosition.x;
   const dy = closestEnemy.pos.y - currentPosition.y;

   if (Math.abs(dx) > Math.abs(dy)) {
      const newPos = {
         x: currentPosition.x + Math.sign(dx),
         y: currentPosition.y,
      };

      if (isPositionValid(newPos, actions)) {
         return mapDirectionToMoveAction(dx > 0 ? 'ltr' : 'rtl');
      }
   } else {
      const newPos = {
         x: currentPosition.x,
         y: currentPosition.y + Math.sign(dy),
      };

      if (isPositionValid(newPos, actions)) {
         return mapDirectionToMoveAction(dy > 0 ? 'ttb' : 'btt');
      }
   }

   return null;
};

const tryToGetActionToMoveAwayFromEnemy = (
   closestEnemy: PlayerType,
   actions: Action[],
) => {
   const state = useMasterState.getState();
   const activePlayer = state.activePlayer()!;
   const currentPosition = getPositionAfterActions(
      activePlayer.pos,
      activePlayer.queueueueueuedActions.concat(actions),
   );
   const dx = closestEnemy.pos.x - currentPosition.x;
   const dy = closestEnemy.pos.y - currentPosition.y;

   if (Math.abs(dx) > Math.abs(dy)) {
      const newPos = {
         x: currentPosition.x - Math.sign(dx),
         y: currentPosition.y,
      };

      if (isPositionValid(newPos, actions)) {
         return mapDirectionToMoveAction(dx > 0 ? 'rtl' : 'ltr');
      }
   } else {
      const newPos = {
         x: currentPosition.x,
         y: currentPosition.y - Math.sign(dy),
      };

      if (isPositionValid(newPos, actions)) {
         return mapDirectionToMoveAction(dy > 0 ? 'btt' : 'ttb');
      }
   }

   return null;
};

const tryToMoveToObstacle = (actions: Action[]) => {
   // Try to find a direction with an obstacle and move there
   const state = useMasterState.getState();
   const { hasObstacle } = state;
   const activePlayer = state.activePlayer()!;
   const currentPosition = getPositionAfterActions(
      activePlayer.pos,
      activePlayer.queueueueueuedActions.concat(actions),
   );
   const moveToObstacle = (): Action | null => {
      const directions: Direction[] = ['ltr', 'rtl', 'ttb', 'btt'];
      for (const dir of directions) {
         const newPos = {
            x:
               currentPosition.x +
               (dir === 'ltr' ? 1 : dir === 'rtl' ? -1 : 0),
            y:
               currentPosition.y +
               (dir === 'ttb' ? 1 : dir === 'btt' ? -1 : 0),
         };

         if (hasObstacle(newPos)) {
            return mapDirectionToMoveAction(dir);
         }
      }
      return null;
   };

   return moveToObstacle();
};

const tryToMoveToRandomValidDirection = (actions: Action[]) => {
   const state = useMasterState.getState();
   const activePlayer = state.activePlayer()!;
   const currentPosition = getPositionAfterActions(
      activePlayer.pos,
      activePlayer.queueueueueuedActions.concat(actions),
   );

   // Try all directions to find a valid move
   const directions: Direction[] = ['ltr', 'rtl', 'ttb', 'btt'];
   const validDirections: Direction[] = [];

   for (const dir of directions) {
      const newPos = {
         x: currentPosition.x,
         y: currentPosition.y,
      };
      switch (dir) {
         case 'ltr':
            newPos.x += 1;
            break;
         case 'rtl':
            newPos.x -= 1;
            break;
         case 'ttb':
            newPos.y += 1;
            break;
         case 'btt':
            newPos.y -= 1;
            break;
      }
      if (isPositionValid(newPos, actions)) {
         validDirections.push(dir);
      }
   }

   if (validDirections.length > 0) {
      const randomDirection =
         validDirections[
            Math.floor(Math.random() * validDirections.length)
         ];
      return mapDirectionToMoveAction(randomDirection);
   }
};

export const AIPlayerLogic = async () => {
   const state = useMasterState.getState();
   const activePlayer = state.activePlayer();

   if (!activePlayer) {
      //   console.log('No active player for the AI.');
      return;
   }

   console.log(
      `AI is taking its turn: Player name ${activePlayer.name}`,
   );

   const { queueueueAction, actionsPerTurn } = state;

   const actions: Action[] = [];
   let actionsUsed = 0;

   const actionsLeft = actionsUsed < actionsPerTurn;
   const attackActions = getAttackActions(actions);
   const canAttack =
      attackActions.length < activePlayer.attacksPerTurn &&
      actionsLeft;
   const closestEnemy = findClosestEnemy(actions);
   const attackAction = getAttackAction(closestEnemy?.pos, actions);

   if (closestEnemy && canAttack && attackAction) {
      // 1. Try to attack if an enemy is in range or by random, handled by getAttackAction
      actions.push(attackAction);
      actionsUsed++;
   } else if (closestEnemy && canAttack) {
      // 2. If can attack but enemy not near enough, try to move towards the closest enemy

      const actionToMoveTowardsEnemy =
         tryToGetActionToMoveTowardsEnemy(closestEnemy, actions);

      if (actionToMoveTowardsEnemy) {
         actions.push(actionToMoveTowardsEnemy);
         actionsUsed++;
      }
   } else if (closestEnemy) {
      // 3. If can't attack, try to move away from the closest enemy
      const actionToMoveAwayFromEnemy =
         tryToGetActionToMoveAwayFromEnemy(closestEnemy, actions);

      if (actionToMoveAwayFromEnemy) {
         actions.push(actionToMoveAwayFromEnemy);
         actionsUsed++;
      }
   }

   if (actions.length === 0 && actionsLeft) {
      // 4. If no enemies nearby, try to move to an random direction
      const actionToMoveToObstacle =
         tryToMoveToRandomValidDirection(actions);

      if (actionToMoveToObstacle) {
         actions.push(actionToMoveToObstacle);
         actionsUsed++;
      } else {
         // 5. If no valid direction, try to move to an obstacle direction
         const actionToMoveToObstacle = tryToMoveToObstacle(actions);

         if (actionToMoveToObstacle) {
            actions.push(actionToMoveToObstacle);
            actionsUsed++;
         }
      }
   }

   // 3. Queue the AI's actions
   if (actions.length > 0) {
      queueueueAction(activePlayer.id, actions, false);
      console.log(`AI queued ${actions.length} actions.`);
   } else {
      // Set random action if no actions were queued
      const randomAction = Math.floor(Math.random() * 4);
      queueueueAction(activePlayer.id, [randomAction], false);
   }
};

// Run the AI logic periodically during the game phase
export const runAI = () => {
   const state = useMasterState.getState();

   if (state.gamePhase === GamePhase.Planning && state.playerTurn) {
      const activePlayer = state.activePlayer();

      if (activePlayer && activePlayer.isAI) {
         AIPlayerLogic();
         return true;
      } else {
         //  console.log('No active AI player or not AI turn.');
         return false;
      }
   } else {
      //   console.log('Game phase is not Planning or not player turn.');
      return false;
   }
};

export const makeAIMoves = async (times: number) => {
   const state = useMasterState.getState();
   for (let i = 0; i < times; i++) {
      await sleep(250);
      const success = runAI();

      if (!success) {
         console.log(
            'AI turn failed, stopping AI moves. Player name is',
            state.activePlayer()?.name,
         );
         break;
      }

      await sleep(250);
   }
};
