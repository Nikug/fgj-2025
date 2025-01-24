import { create } from 'zustand';
import { V2 } from '../types';
import { immer } from 'zustand/middleware/immer';

interface Player {
   pos: V2;
   id: number;
}

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
      players: [{ pos: { x: 0, y: 0 }, id: 0 }],
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

