import { create } from 'zustand';
import {
   GamePhase,
   Player,
   V2,
   Action,
   Scene,
   Weapon,
   Direction,
   Obstacle,
} from '../types';
import { immer } from 'zustand/middleware/immer';
import { randomInt, shuffleList } from '../random';
import { cols, rows } from '../App';
import { resolver } from './resolver';
import { id } from '../id';
import { playerOverlap, randomPos } from './notUtils';
import { obstacleList } from '../map';
import { startGameMusic, stopGameMusic } from '../audio';

export interface MasterState {
   scene: Scene;
   setScene: (scene: Scene) => void;

   gamePhase: GamePhase;
   setGamePhase: (phase: GamePhase) => void;

   players: Player[];
   deadPlayers: Player[];
   setPlayers: (players: Player[]) => void;
   queueueueAction: (id: string, actions: Action[]) => void;

   weapons: Weapon[];

   playerTurn: string | null;
   activePlayer: () => Player | null;
   setPlayerTurn: (id: string) => void;
   getPlayerTurn: () => Player | null;

   playerOrder: string[];
   setPlayerOrder: (ids: string[]) => void;

   actionsPerTurn: number;
   weaponMovePerTurn: number;
   runActionPhase: () => Promise<void>;

   obstacles: Obstacle[];
   hasObstacle: (pos: V2) => boolean;
   damageObstacle: (pos: V2, damage: number) => void;

   killPlayer: (id: string) => void;
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
            return {
               scene,
               playerOrder,
               players,
               gamePhase: GamePhase.Planning,
               playerTurn: playerOrder[0] ?? null,
            };
         }),
      playerOrder: [],
      actionsPerTurn: 5,
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
         set(() => ({ players, playerTurn: players[0].id })),
      weapons: [],
      runActionPhase: async () => {
         await resolver();
      },
      queueueueAction: (id, actions) => {
         if (get().gamePhase === GamePhase.Action) return;
         set(state => {
            const p = state.players.find((e: any) => e.id == id);

            if (!p) return;

            p.queueueueueuedActions = [
               ...p.queueueueueuedActions,
               ...actions,
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
      obstacles: obstacleList(),
      hasObstacle: (pos: V2) =>
         get().obstacles.some(
            ob => ob.pos.x === pos.x && ob.pos.y === pos.y,
         ),
      damageObstacle: (pos: V2, damage: number) =>
         set(state => {
            state.obstacles = [];
            state.obstacles.forEach(obstacle => {
               if (
                  obstacle.pos.x === pos.x &&
                  obstacle.pos.y === pos.y
               ) {
                  obstacle.health -= damage;
                  if (obstacle.health > 0) {
                     state.obstacles.push(obstacle);
                  }
               } else state.obstacles.push(obstacle);
            });
         }),
      killPlayer: id =>
         set(state => {
            const newPlayers: Player[] = [];
            for (const player of state.players) {
               if (player.id === id) {
                  state.deadPlayers.push(player);
               } else {
                  newPlayers.push(player);
               }
            }
            state.players = newPlayers;
         }),
   })),
);
