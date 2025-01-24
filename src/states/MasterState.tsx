import { create } from 'zustand';
import { GamePhase, Player, V2 } from '../types';
import { immer } from 'zustand/middleware/immer';

interface MasterState {
   count: number;
   increase: () => void;

   gamePhase: GamePhase;
   setGamePhase: (phase: GamePhase) => void;

   players: Player[];
   setPlayers: (players: Player[]) => void;
   movePlayer: (id: string, pos: V2) => void;
}

export const useMasterState = create<MasterState>()(
   immer(set => ({
      count: 0,
      increase: () => set(state => ({ count: state.count + 1 })),
      gamePhase: GamePhase.Planning,
      setGamePhase: phase => set(() => ({ phase })),
      players: [],
      setPlayers: players => set(() => ({ players })),
      movePlayer: (id, pos) =>
         set(state => {
            const p = state.players.find(e => e.id == id);
            if (p) {
               p.pos = pos;
            }
         }),
   })),
);
