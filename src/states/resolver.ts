import { cols, rows } from '../App';
import { id } from '../id';
import { shuffleList } from '../random';
import { sleep } from '../sleep';
import {
   Action,
   GamePhase,
   Player,
   PowerUp,
   UnlimitedPoweeer,
   V2,
   Weapon,
   WeaponType,
} from '../types';
import {} from '../types';
import { MasterState, useMasterState } from './MasterState';
import { moveFromElementToElement, popPlayer } from '../Vilperi';
import {
   getRandomPoveeeeer,
   oob,
   playerOverlap,
   randomPos,
   weaponOverlap,
} from './notUtils';
import { animeWeaponMove, getNextPos } from '../aleksi/aleksi';
import { playerTypeToWeaponType } from '../superSecretFile';
import { playSound } from '../audio';

const TimeBetweenActions = 600;

export const resolver = async () => {
   await sleep(TimeBetweenActions);

   useMasterState.setState(state => shuffleList(state.players));
   await resolveMovements();
   useMasterState.setState(
      state => (state.gamePhase = GamePhase.ActionAction),
   );
   await resolveProjectiles();

   // Reset state back to planning
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

const resolveProjectiles = async () => {
   let weapons = useMasterState.getState().weapons;
   const checkedWeapons: Weapon[] = [];
   while (weapons.length > 0) {
      const nextWeapon = weapons[0];
      await handleWeapon(nextWeapon);
      checkedWeapons.push(nextWeapon);

      weapons = useMasterState
         .getState()
         .weapons.filter(
            w => !checkedWeapons.find(e => e.id == w.id),
         );
   }
};

const handleWeapon = async (w: Weapon) => {
   const moveWeapon = useMasterState.getState().moveWeapon;
   const weaponDistance =
      w.type == WeaponType.Lazor ?
         69
      :  useMasterState.getState().weaponMovePerTurn;
   const handleWeaponPos = useMasterState.getState().checkWeaponPos;

   const id = w.id;
   handleWeaponPos(w);
   for (let i = 0; i < weaponDistance; i++) {
      const weapon = useMasterState
         .getState()
         .weapons.find(e => e.id === id);
      if (!weapon) {
         return;
      }
      const nextPos = getNextPos(weapon!.pos, weapon!.direction);
      playSound('projectile');
      await moveWeapon(weapon!, nextPos);
      animeWeaponMove(weapon!, nextPos);
      await sleep(310);
      if (
         nextPos.x > 10 ||
         nextPos.y > 10 ||
         nextPos.x < 0 ||
         nextPos.y < 0
      ) {
         break;
      }
      handleWeaponPos(weapon!);
   }
};

const resolveMovements = async () => {
   let alivePlayerCount = useMasterState.getState().players.length;
   const kill = useMasterState.getState().killPlayer;
   const removeWeapons = useMasterState.getState().removeWeapons;

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
         const powers = useMasterState.getState().powers;

         console.log('player actions', player.queueueueueuedActions);
         console.log('powers', powers);

         const newPos = { ...player.pos };
         const moevement = getMovement(action, player.pos);
         const weapons = useMasterState.getState().weapons;

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

            const overlappingWeapon = weaponOverlap(
               moevement,
               weapons,
            );
            if (overlappingWeapon) {
               await sleep(2000);
               popPlayer(player);
               removeWeapons([overlappingWeapon]);
            }
         }

         // TIME BETWEEN ACTIONS SLEEP
         // UPDATE STATE AFTER ANIMATION
         await sleep(TimeBetweenActions);

         switch (action) {
            case Action.Nothing:
               break;
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
                  checkPowerUpFromPos(player.id, newPos, state);
               });
               playSound('move');
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
                  checkPowerUpFromPos(player.id, newPos, state);
               });
               playSound('move');
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
                  checkPowerUpFromPos(player.id, newPos, state);
               });
               playSound('move');
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
                  checkPowerUpFromPos(player.id, newPos, state);
               });
               playSound('move');
               break;
            case Action.AttackUp: {
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
                  playerId: player.id,
                  type: playerTypeToWeaponType(player),
               };
               useMasterState.setState(state => {
                  state.weapons = [...state.weapons, newWeaponUp];
               });
               playSound('attack');
               break;
            }
            case Action.AttackDown: {
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
                  playerId: player.id,
                  type: playerTypeToWeaponType(player),
               };
               useMasterState.setState(state => {
                  state.weapons = [...state.weapons, newWeaponDown];
               });
               playSound('attack');
               break;
            }
            case Action.AttackLeft: {
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
                  playerId: player.id,
                  type: playerTypeToWeaponType(player),
               };
               useMasterState.setState(state => {
                  state.weapons = [...state.weapons, newWeaponLeft];
               });

               playSound('attack');
               break;
            }
            case Action.AttackRight: {
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
                  playerId: player.id,
                  type: playerTypeToWeaponType(player),
               };
               useMasterState.setState(state => {
                  state.weapons = [...state.weapons, newWeaponRight];
               });
               playSound('attack');
               break;
            }
            default:
               window.alert('what');
         }

         if (weaponOverlap(moevement, weapons)) {
            kill(player.id);
            playerIndex--;
            alivePlayerCount--;
            break;
         }
      }
   }

   await sleep(TimeBetweenActions);

   useMasterState.setState(state => {
      const newPower: UnlimitedPoweeer = {
         id: id(),
         type: getRandomPoveeeeer(),
         pos: randomPos(cols, rows),
      };
      state.gamePhase = GamePhase.Planning;
      state.players = state.players.map(player => ({
         ...player,
         queueueueueuedActions: [],
      }));
      state.powers = [...state.powers, newPower];
      state.players = shuffleList(state.players);
      state.playerOrder = state.players.map(p => p.id);
      state.playerTurn = state.players[0].id;
   });
};

export const getGridElementMoveFrom = (x: number, y: number) => {
   // Get element to move from
   return document.querySelector(
      `.game-tile[data-x="${x}"][data-y="${y}"]`,
   ) as HTMLElement | null;
};

export const getGridElementMoveTo = (x: number, y: number) => {
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

const checkPowerUpFromPos = (
   id: string,
   pos: V2,
   state: MasterState,
) => {
   const power = state.powers.find(
      e => e.pos.x === pos.x && e.pos.y === pos.y,
   );
   if (power) {
      if (power.type == PowerUp.Lazor) {
         const p = state.players.find(e => e.id === id);
         if (p) {
            const i = state.players.indexOf(p);
            state.players[i].hasLazor = true;
         }
      }
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
