import { create } from 'zustand';
import { Player, V2 } from '../types';
import { immer } from 'zustand/middleware/immer';

interface MasterState {
   count: number;
   increase: () => void;

   players: Player[];
   setPlayers: (players: Player[]) => void;
   movePlayer: (id: number, pos: V2) => void;
}

export const useMasterState = create<MasterState>()(
   immer(set => ({
      count: 0,
      increase: () => set(state => ({ count: state.count + 1 })),
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
