import { create } from 'zustand';
import {
   GamePhase,
   Player,
   V2,
   Action,
   Scene,
   Weapon,
   Obstacle,
   UnlimitedPoweeer,
   WeaponType,
} from '../types';
import { immer } from 'zustand/middleware/immer';
import { shuffleList } from '../random';
import { cols, countPlayerAttacks, rows } from '../App';
import { resolver } from './resolver';
import { playerOverlap, randomPos } from './notUtils';
import { obstacleList } from '../map';
import { playSound, startGameMusic, stopGameMusic } from '../audio';
import { isAttack } from '../superSecretFile';
import { getFromPos } from '../aleksi/aleksi';
import { popPlayer } from '../Vilperi';

export interface MasterState {
   scene: Scene;
   setScene: (scene: Scene) => void;

   gamePhase: GamePhase;
   setGamePhase: (phase: GamePhase) => void;

   players: Player[];
   deadPlayers: Player[];
   setPlayers: (players: Player[]) => void;
   queueueueAction: (
      id: string,
      actions: Action[],
      newWaitingAction: boolean,
   ) => void;

   weapons: Weapon[];
   powers: UnlimitedPoweeer[];

   playerTurn: string | null;
   activePlayer: () => Player | null;
   setPlayerTurn: (id: string) => void;
   getPlayerTurn: () => Player | null;

   playerOrder: string[];
   setPlayerOrder: (ids: string[]) => void;

   actionsPerTurn: number;
   addExtraAttack: (player: Player) => void;
   actionActionsPerTurn: number;
   weaponMovePerTurn: number;
   moveWeapon: (weapon: Weapon, pos: V2) => void;
   runActionPhase: () => Promise<void>;

   obstacles: Obstacle[];
   hasObstacle: (pos: V2) => boolean;
   damageObstacle: (pos: V2, damage: number) => void;

   killPlayer: (id: string, killerId: string) => void;
   waitingAction: boolean;
   setWaitingAction: (wait: boolean) => void;
   removeWeapons: (weapons: Weapon[]) => void;
   checkWeaponPos: (weapon: Weapon) => void;

   scoreboard: Record<string, number>;
   addScore: (playerId: string, score: number) => void;
}

export const useMasterState = create<MasterState>()(
   immer((set, get) => ({
      scene: Scene.StartMenu,
      setScene: scene =>
         set(state => {
            let playerOrder: string[] = [];
            let players: Player[] = [];

            if (scene === Scene.Game) {
               players = shuffleList(state.players);
               players = players.map(player => {
                  let newPos: V2 = randomPos(cols, rows);
                  while (
                     state.hasObstacle(newPos) ||
                     playerOverlap(newPos, state.players)
                  ) {
                     newPos = randomPos(cols, rows);
                  }

                  return {
                     ...player,
                     pos: newPos,
                  };
               });
               startGameMusic();
            } else {
               stopGameMusic();
            }

            playerOrder = players.map(e => e.id);

            // Reset state
            return {
               scene,
               playerOrder,
               players,
               gamePhase: GamePhase.Planning,
               playerTurn: playerOrder[0] ?? null,
               weapons: [],
               deadPlayers: [],
               obstacles: obstacleList(),
               scoreboard: {},
            };
         }),
      playerOrder: [],
      actionsPerTurn: 5,
      addExtraAttack: player =>
         set(state => {
            const targetPlayerIndex = get().players.findIndex(
               targetPlayer => player.id === targetPlayer.id,
            );

            if (targetPlayerIndex === -1) {
               console.error(
                  'Tried to give extra attack to non existing player',
               );
               return;
            }

            state.players[targetPlayerIndex].attacksPerTurn += 1;
         }),

      actionActionsPerTurn: 1,
      weaponMovePerTurn: 3,
      setPlayerOrder: ids => set(() => ({ playerOrder: ids })),
      gamePhase: GamePhase.Planning,
      setGamePhase: phase =>
         set(state => {
            state.gamePhase = phase;

            // Minor fixes
            if (
               phase === GamePhase.Planning &&
               state.gamePhase === GamePhase.Action
            ) {
               const found = state.playerOrder.filter(id =>
                  state.players.find(
                     player => player.id === id && !player.isDead,
                  ),
               );
               state.playerOrder = found;
               state.playerTurn = state.playerOrder[0] ?? null;
            }
         }),
      players: [],
      deadPlayers: [],
      playerTurn: null,
      activePlayer: () =>
         get().players.find(p => p.id === get().playerTurn) ?? null,
      setPlayerTurn: id => set(() => ({ playerTurn: id })),
      getPlayerTurn: () => {
         const players = get().players;
         const turn = get().playerTurn;
         return players.find(e => e.id === turn) ?? null;
      },
      setPlayers: players =>
         set(() => ({
            players,
            playerTurn: players[0]?.id ?? null,
         })),
      weapons: [],
      powers: [],
      runActionPhase: async () => {
         await resolver();
      },
      removeWeapons: weapons => {
         set(state => {
            state.weapons = state.weapons.filter(
               w => !weapons.find(e => e.id == w.id),
            );
         });
      },
      queueueueAction: (id, actions, newWaitingAction) => {
         if (get().gamePhase !== GamePhase.Planning) return;
         set(state => {
            const p = state.players.find((e: any) => e.id == id);

            if (!p) return;

            state.waitingAction = newWaitingAction;

            const isAttackAction = isAttack(actions[0]);

            const attacksUsed = countPlayerAttacks(p);

            const alreadyDoneAttack =
               p.attacksPerTurn <= attacksUsed;

            let newAction = actions[0];
            if (
               (isAttackAction && alreadyDoneAttack) ||
               newAction == null
            ) {
               newAction = Action.Nothing;
            }

            if (isAttackAction) {
               playSound('attack', 0.8);
            } else {
               playSound('move', 0.7);
            }

            if (
               p.queueueueueuedActions.length < state.actionsPerTurn
            ) {
               p.queueueueueuedActions = [
                  ...p.queueueueueuedActions,
                  newAction,
               ];
            }

            if (
               p.queueueueueuedActions.length >= state.actionsPerTurn
            ) {
               const currentIndex = state.playerOrder.indexOf(
                  state.playerTurn ?? state.playerOrder[0],
               );
               let nextTurn: string | undefined =
                  state.playerOrder[currentIndex + 1];
               if (nextTurn) {
                  const nextPlayer = state.players.find(
                     p => p.id === nextTurn,
                  );
                  if (!nextPlayer || nextPlayer.isDead) {
                     // Panic mode, this should not happen but it keeps happening all the time
                     console.log('Going to panic');
                     console.log('AAAAAAAAAAAAAA');
                     // Create new order from player list
                     const newNewOrder = state.players.filter(
                        p => !p.isDead,
                     );
                     const newIndex = newNewOrder.find(
                        p => p.queueueueueuedActions.length === 0,
                     );
                     state.playerOrder = newNewOrder.map(p => p.id);
                     const nextNextTurn = newIndex?.id;
                     if (nextNextTurn) nextTurn = nextNextTurn;
                     else state.gamePhase = GamePhase.Action;
                  } else {
                     state.playerTurn = nextTurn;
                     state.gamePhase = GamePhase.NextTurn;
                  }
               } else {
                  state.gamePhase = GamePhase.Action;
               }
            }
         });

         if (get().gamePhase === GamePhase.Action) {
            get().runActionPhase();
         }
      },
      moveWeapon: (w, pos) => {
         set(state => {
            console.log('hahaa', pos);
            state.weapons.find(e => e.id == w.id)!.pos = pos;
         });
      },
      checkWeaponPos: a => {
         const obstacles = get().obstacles;
         const players = get().players;
         const damageObstacle = get().damageObstacle;
         const kill = get().killPlayer;
         const removeWeapons = get().removeWeapons;
         const allWeapons = get().weapons;
         const w = get().weapons.find(e => e.id === a.id)!;
         const target = getFromPos(
            w,
            obstacles,
            players,
            allWeapons,
         );

         if (target.player) {
            playSound('hit');
            popPlayer(target.player, () => {
               kill(target.player!.id, a.playerId);
            });
            console.log('hit player', target.player);
            if (w.type != WeaponType.Lazor) {
               removeWeapons([w]);
            }
            return;
         }
         if (target.obs) {
            playSound('hit');
            damageObstacle(target.obs.pos, 1);
            console.log('damaged obstacle', target.obs);
            if (w.type != WeaponType.Lazor) {
               removeWeapons([w]);
            }
            return;
         }
         if (target.weapon) {
            playSound('hit');
            if (w.type != WeaponType.Lazor) {
               removeWeapons([w, target.weapon]);
            } else {
               removeWeapons([target.weapon]);
            }
            return;
         }
      },

      obstacles: obstacleList(),
      hasObstacle: (pos: V2) =>
         get().obstacles.some(
            ob => ob.pos.x === pos.x && ob.pos.y === pos.y,
         ),
      damageObstacle: (pos: V2, damage: number) =>
         set(state => {
            const remainingObstacles: Obstacle[] = [];
            state.obstacles.forEach(obstacle => {
               if (
                  obstacle.pos.x === pos.x &&
                  obstacle.pos.y === pos.y
               ) {
                  obstacle.health -= damage;
                  if (obstacle.health > 0) {
                     remainingObstacles.push(obstacle);
                  }
               } else {
                  remainingObstacles.push(obstacle);
               }
            });
            state.obstacles = remainingObstacles;
         }),
      killPlayer: (id, killerId) => {
         set(state => {
            const newPlayers: Player[] = [];
            for (const player of state.players) {
               if (player.id === id) {
                  state.deadPlayers.push({
                     ...player,
                     isDead: true,
                     queueueueueuedActions: [],
                  });
               } else {
                  newPlayers.push(player);
               }
            }
            state.players = newPlayers;
         });

         get().addScore(killerId, id === killerId ? -1 : 1);
      },
      waitingAction: false,
      setWaitingAction: (wait: boolean) =>
         set(() => ({ waitingAction: wait })),

      scoreboard: {},
      addScore: (playerId: string, score: number) =>
         set(state => {
            if (state.scoreboard[playerId])
               state.scoreboard[playerId] += score;
            else state.scoreboard[playerId] = score;
         }),
   })),
);
