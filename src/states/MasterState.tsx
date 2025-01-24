import { create } from 'zustand';
import { GamePhase, Player, V2, Action } from '../types';
import { immer } from 'zustand/middleware/immer';

interface MasterState {
   gamePhase: GamePhase;
   setGamePhase: (phase: GamePhase) => void;

   players: Player[];
   setPlayers: (players: Player[]) => void;
   movePlayer: (id: string, pos: V2) => void;
   queueueueAction: (id: string, actions: Action[]) => void;

   playerTurn: string | null;
   setPlayerTurn: (id: string) => void;
   getPlayerTurn: () => Player | null;
}

export const useMasterState = create<MasterState>()(
   immer((set, get) => ({
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
            if (p) {
               p.queueueueueuedActions = actions;
            }
         }),
   })),
);
