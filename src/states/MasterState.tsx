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
}

export const useMasterState = create<MasterState>()(
   immer(set => ({
      gamePhase: GamePhase.Planning,
      setGamePhase: phase => set(() => ({ phase })),
      players: [],
      setPlayers: players => set(() => ({ players })),
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
