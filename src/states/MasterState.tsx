import { create } from 'zustand';
import {
   GamePhase,
   Player,
   V2,
   Action,
   Scene,
   Weapon,
   Obstacle,
} from '../types';
import { immer } from 'zustand/middleware/immer';
import { shuffleList } from '../random';
import { cols, rows } from '../App';
import { resolver } from './resolver';
import { playerOverlap, randomPos } from './notUtils';
import { obstacleList } from '../map';
import { startGameMusic, stopGameMusic } from '../audio';
import { isAttack } from '../superSecretFile';

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

   playerTurn: string | null;
   activePlayer: () => Player | null;
   setPlayerTurn: (id: string) => void;
   getPlayerTurn: () => Player | null;

   playerOrder: string[];
   setPlayerOrder: (ids: string[]) => void;

   actionsPerTurn: number;
   actionActionsPerTurn: number;
   weaponMovePerTurn: number;
   moveWeapon: (weapon: Weapon, pos: V2) => Promise<void>;
   runActionPhase: () => Promise<void>;

   obstacles: Obstacle[];
   hasObstacle: (pos: V2) => boolean;
   damageObstacle: (pos: V2, damage: number) => void;

   killPlayer: (id: string) => void;
   waitingAction: boolean;
   setWaitingAction: (wait: boolean) => void;
   removeWeapons: (weapons: Weapon[]) => void;
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
            };
         }),
      playerOrder: [],
      actionsPerTurn: 5,
      actionActionsPerTurn: 1,
      weaponMovePerTurn: 3,
      setPlayerOrder: ids => set(() => ({ playerOrder: ids })),
      gamePhase: GamePhase.Planning,
      setGamePhase: phase => set(() => ({ phase })),
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
            const alreadyDoneAttack =
               p.queueueueueuedActions.some(isAttack);

            let newAction = actions[0];
            if (isAttackAction && alreadyDoneAttack) {
               newAction = Action.Nothing;
            }

            p.queueueueueuedActions = [
               ...p.queueueueueuedActions,
               newAction,
            ];
            if (
               p.queueueueueuedActions.length >= state.actionsPerTurn
            ) {
               const currentIndex = state.playerOrder.indexOf(
                  state.playerTurn ?? state.playerOrder[0],
               );
               const nextTurn = state.playerOrder[currentIndex + 1];
               if (nextTurn) state.playerTurn = nextTurn;
               else state.gamePhase = GamePhase.Action;
            }
         });

         if (get().gamePhase === GamePhase.Action) {
            get().runActionPhase();
         }
      },
      moveWeapon: async (w, pos) => {
         return new Promise(resolve => {
            set(state => {
               console.log('hahaa', pos);
               state.weapons.find(e => e.id == w.id)!.pos = pos;
            });
            resolve();
         });
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
      killPlayer: id =>
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
         }),
      waitingAction: false,
      setWaitingAction: (wait: boolean) =>
         set(() => ({ waitingAction: wait })),
   })),
);
