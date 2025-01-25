import { cols, rows } from '../App';
import { id } from '../id';
import { shuffleList } from '../random';
import { sleep } from '../sleep';
import { Action, GamePhase, Player, V2, Weapon } from '../types';
import { useMasterState } from './MasterState';
import { oob, playerOverlap } from './notUtils';
import { moveFromElementToElement } from '../Vilperi';
import { getFromPos, getNextPos, getTarget } from '../aleksi/aleksi';

const TimeBetweenActions = 1000;

export const resolver = async () => {
   await sleep(TimeBetweenActions);

   useMasterState.setState(state => shuffleList(state.players));
   await resolveMovements();
   await resolveProjectiles();
};

const resolveProjectiles = async () => {
   const weapons = useMasterState.getState().weapons;
   for (const weapon of weapons) {
      await handleWeapon(weapon);
   }
};

const handleWeapon = async (weapon: Weapon) => {
   const obstacles = useMasterState.getState().obstacles;
   const players = useMasterState.getState().players;
   const weaponDistance =
      useMasterState.getState().weaponMovePerTurn;
   const damageObstacle = useMasterState.getState().damageObstacle;
   const kill = useMasterState.getState().killPlayer;
   const moveWeapon = useMasterState.getState().moveWeapon;
   for (let i = 0; i < weaponDistance; i++) {
      const nextPos = getNextPos(weapon.pos, weapon.direction);
      await moveWeapon(weapon, nextPos);
      if (
         nextPos.x > 10 ||
         nextPos.y > 10 ||
         nextPos.x < 0 ||
         nextPos.y < 0
      ) {
         console.log('hit wall');
         break;
      }
      const target = getFromPos(nextPos, obstacles, players);
      if (target.player) {
         kill(target.player.id);
         console.log('hit player');
         break;
      }
      if (target.obs) {
         damageObstacle(target.obs.pos, 1);
         console.log('damaged obstacle');
         break;
      }
   }
};

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
            case Action.AttackUp:
               const weaponPosUp: V2 = {
                  x: player.pos.x,
                  y: player.pos.y - 1,
               };

               if (
                  oob(weaponPosUp, cols, rows) ||
                  useMasterState.getState().hasObstacle(weaponPosUp)
               ) {
                  break;
               }

               const newWeaponUp: Weapon = {
                  id: id(),
                  pos: weaponPosUp,
                  direction: 'btt',
               };
               useMasterState.setState(state => {
                  state.weapons = [...state.weapons, newWeaponUp];
               });
               break;
            case Action.AttackDown:
               const weaponPosDown: V2 = {
                  x: player.pos.x,
                  y: player.pos.y + 1,
               };

               if (
                  oob(weaponPosDown, cols, rows) ||
                  useMasterState
                     .getState()
                     .hasObstacle(weaponPosDown)
               ) {
                  break;
               }

               const newWeaponDown: Weapon = {
                  id: id(),
                  pos: weaponPosDown,
                  direction: 'ttb',
               };
               useMasterState.setState(state => {
                  state.weapons = [...state.weapons, newWeaponDown];
               });
               break;
            case Action.AttackLeft:
               const weaponPosLeft: V2 = {
                  x: player.pos.x - 1,
                  y: player.pos.y,
               };

               if (
                  oob(weaponPosLeft, cols, rows) ||
                  useMasterState
                     .getState()
                     .hasObstacle(weaponPosLeft)
               ) {
                  break;
               }

               const newWeaponLeft: Weapon = {
                  id: id(),
                  pos: weaponPosLeft,
                  direction: 'rtl',
               };
               useMasterState.setState(state => {
                  state.weapons = [...state.weapons, newWeaponLeft];
               });
               break;
            case Action.AttackRight:
               const weaponPosRight: V2 = {
                  x: player.pos.x + 1,
                  y: player.pos.y,
               };

               if (
                  oob(weaponPosRight, cols, rows) ||
                  useMasterState
                     .getState()
                     .hasObstacle(weaponPosRight)
               ) {
                  break;
               }

               const newWeaponRight: Weapon = {
                  id: id(),
                  pos: weaponPosRight,
                  direction: 'ltr',
               };
               useMasterState.setState(state => {
                  state.weapons = [...state.weapons, newWeaponRight];
               });
               break;
            default:
               window.alert('what');
         }
      }
   }

   await sleep(TimeBetweenActions);

   useMasterState.setState(state => {
      state.gamePhase = GamePhase.ActionAction;
      state.players = state.players.map(player => ({
         ...player,
         queueueueueuedActions: [],
      }));
      // state.players = shuffleList(state.players);
      // state.playerOrder = state.players.map(p => p.id);
      // state.playerTurn = state.players[0].id;
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
