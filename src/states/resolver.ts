import { cols, rows } from '../App';
import { id } from '../id';
import { shuffleList } from '../random';
import { sleep } from '../sleep';
import { Action, GamePhase, Player, Weapon } from '../types';
import { useMasterState } from './MasterState';
import { playerOverlap } from './notUtils';
import { moveFromElementToElement } from '../Vilperi';

const TimeBetweenActions = 1000;

export const resolver = async () => {
   await sleep(TimeBetweenActions);

   useMasterState.setState(state => shuffleList(state.players));
   await resolveMovements();
   await resolveProjectiles();
};
const resolveProjectiles = async () => {};
const resolveMovements = async () => {
   const alivePlayerCount = useMasterState.getState().players.length;

   // Main loop
   for (
      let playerIndex = 0;
      playerIndex < alivePlayerCount;
      playerIndex++
   ) {
      useMasterState.setState(state => {
         state.playerTurn = state.players[playerIndex].id;
      });

      for (
         let actionIndex = 0;
         actionIndex <
         useMasterState.getState().players[playerIndex]
            .queueueueueuedActions.length;
         actionIndex++
      ) {
         const player =
            useMasterState.getState().players[playerIndex];
         const action = player.queueueueueuedActions[actionIndex];

         const newPos = { ...player.pos };
         const moevement = getMovement(action, player.pos);

         // DO NOT REMOVE THIS SLEEP OR YOU WILL FUCKED UP
         await sleep(1);
         if (
            !useMasterState.getState().hasObstacle(moevement) &&
            !playerOverlap(
               moevement,
               useMasterState.getState().players,
            )
         ) {
            animatePlayerMovement(player, moevement);
         }

         // TIME BETWEEN ACTIONS SLEEP
         // UPDATE STATE AFTER ANIMATION
         await sleep(TimeBetweenActions);

         switch (action) {
            case Action.MoveUp:
               useMasterState.setState(state => {
                  newPos.y -= 1;
                  if (newPos.y < 0) newPos.y = 0;
                  if (
                     !playerOverlap(newPos, state.players) &&
                     !state.hasObstacle(newPos)
                  ) {
                     state.players[playerIndex].pos = newPos;
                  }
               });
               break;
            case Action.MoveDown:
               useMasterState.setState(state => {
                  newPos.y += 1;
                  if (newPos.y >= rows) newPos.y = rows - 1;
                  if (
                     !playerOverlap(newPos, state.players) &&
                     !state.hasObstacle(newPos)
                  ) {
                     state.players[playerIndex].pos = newPos;
                  }
               });
               break;
            case Action.MoveLeft:
               useMasterState.setState(state => {
                  newPos.x -= 1;
                  if (newPos.x < 0) newPos.x = 0;
                  if (
                     !playerOverlap(newPos, state.players) &&
                     !state.hasObstacle(newPos)
                  ) {
                     state.players[playerIndex].pos = newPos;
                  }
               });
               break;
            case Action.MoveRight:
               useMasterState.setState(state => {
                  newPos.x += 1;
                  if (newPos.x >= cols) newPos.x = cols - 1;
                  if (
                     !playerOverlap(newPos, state.players) &&
                     !state.hasObstacle(newPos)
                  ) {
                     state.players[playerIndex].pos = newPos;
                  }
               });
               break;
            case Action.Attack:
               const newWeapon: Weapon = {
                  id: id(),
                  pos: { x: player.pos.x + 1, y: player.pos.y },
                  direction: 'ltr',
               };
               useMasterState.setState(state => {
                  state.weapons = [...state.weapons, newWeapon];
               });
               break;
            default:
               window.alert('what');
         }
      }
   }

   await sleep(TimeBetweenActions);

   useMasterState.setState(state => {
      state.gamePhase = GamePhase.Planning;
      state.players = state.players.map(player => ({
         ...player,
         queueueueueuedActions: [],
      }));
      state.players = shuffleList(state.players);
      state.playerOrder = state.players.map(p => p.id);
      state.playerTurn = state.players[0].id;
   });
};

const getGridElementMoveFrom = (x: number, y: number) => {
   // Get element to move from
   return document.querySelector(
      `.game-tile[data-x="${x}"][data-y="${y}"]`,
   ) as HTMLElement | null;
};

const getGridElementMoveTo = (x: number, y: number) => {
   // Get element to move to
   return document.querySelector(
      `.game-tile[data-x="${x}"][data-y="${y}"]`,
   ) as HTMLElement | null;
};

const animatePlayerMovement = (
   player: Player,
   newPos: { x: number; y: number },
) => {
   const elementToMove = document.getElementById(player.elementId);
   const fromElement = getGridElementMoveFrom(
      player.pos.x,
      player.pos.y,
   );

   const toElement = getGridElementMoveTo(newPos.x, newPos.y);

   if (elementToMove && fromElement && toElement) {
      moveFromElementToElement(
         elementToMove,
         fromElement,
         toElement,
      );
   } else {
      console.error(
         'Could not animate movement. One of the elements was null.',
      );
      console.log('element to move', elementToMove);
      console.log('element to move from', fromElement);
      console.log('element to move to', toElement);
   }
};

const getMovement = (
   action: Action,
   position: { x: number; y: number },
) => {
   const newPos = { ...position };
   switch (action) {
      case Action.MoveUp:
         newPos.y -= 1;
         if (newPos.y < 0) newPos.y = 0;

         break;
      case Action.MoveDown:
         newPos.y += 1;
         if (newPos.y >= rows) newPos.y = rows - 1;

         break;
      case Action.MoveLeft:
         newPos.x -= 1;
         if (newPos.x < 0) newPos.x = 0;

         break;
      case Action.MoveRight:
         newPos.x += 1;
         if (newPos.x >= cols) newPos.x = cols - 1;

         break;

      default:
   }
   return newPos;
};
