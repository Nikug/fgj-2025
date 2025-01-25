import { create } from 'zustand';
import { GamePhase, Player, V2, Action, Scene } from '../types';
import { immer } from 'zustand/middleware/immer';
import { randomInt, shuffleList } from '../random';
import { cols, rows } from '../App';

export interface MasterState {
   scene: Scene;
   setScene: (scene: Scene) => void;

   gamePhase: GamePhase;
   setGamePhase: (phase: GamePhase) => void;

   players: Player[];
   setPlayers: (players: Player[]) => void;
   movePlayer: (id: string, pos: V2) => void;
   queueueueAction: (id: string, actions: Action[]) => void;

   playerTurn: string | null;
   setPlayerTurn: (id: string) => void;
   getPlayerTurn: () => Player | null;

   playerOrder: string[];
   setPlayerOrder: (ids: string[]) => void;

   actionsPerTurn: number;
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
               players = players.map(player => ({
                  ...player,
                  pos: {
                     x: randomInt(0, cols - 1),
                     y: randomInt(0, rows - 1),
                  },
               }));
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
      setPlayerOrder: ids => set(() => ({ playerOrder: ids })),
      gamePhase: GamePhase.Planning,
      setGamePhase: phase => set(() => ({ phase })),
      players: [],
      playerTurn: null,
      setPlayerTurn: id => set(() => ({ playerTurn: id })),
      getPlayerTurn: () => {
         const players = get().players;
         const turn = get().playerTurn;
         return players.find(e => e.id === turn) ?? null;
      },
      setPlayers: players =>
         set(() => ({ players, playerTurn: players[0].id })),
      movePlayer: (id, pos) =>
         set(state => {
            const p = state.players.find((e: any) => e.id == id);
            if (p) {
               p.pos = pos;
               console.log(p.queueueueueuedActions[0]);
            }
         }),
      queueueueAction: (id, actions) =>
         set(state => {
            const p = state.players.find((e: any) => e.id == id);

            if (!p) return;

            console.log(actions);

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
         }),
   })),
);
