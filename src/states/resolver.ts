import { cols, rows } from '../App';
import { shuffleList } from '../random';
import { sleep } from '../sleep';
import { Action } from '../types';
import { useMasterState } from './MasterState';

const getState = useMasterState.getState;
const setState = useMasterState.setState;

const TimeBetweenActions = 300;

export const resolver = async () => {
   const players = shuffleList(getState().players);

   await sleep(TimeBetweenActions);

   for (let i = 0; i < players.length; i++) {
      const player = players[i];
      setState(state => (state.playerTurn = player.id));

      if (player.queueueueueuedActions.length === 0) {
         setState(state => (state.players[i] = player));
         continue;
      }

      const action = player.queueueueueuedActions.unshift();
      const newPos = { ...player.pos };
      switch (action) {
         case Action.MoveUp:
            setState(state => {
               newPos.y -= 1;
               if (newPos.y < 0) newPos.y = 0;
               state.players[i] = { ...player, pos: newPos };
            });
            break;
         case Action.MoveDown:
            setState(state => {
               newPos.y += 1;
               if (newPos.y >= rows) newPos.y = rows - 1;
               state.players[i] = { ...player, pos: newPos };
            });
            break;
         case Action.MoveLeft:
            setState(state => {
               newPos.x -= 1;
               if (newPos.x < 0) newPos.x = 0;
               state.players[i] = { ...player, pos: newPos };
            });
            break;
         case Action.MoveRight:
            setState(state => {
               newPos.x == 1;
               if (newPos.x >= cols) newPos.x = cols - 1;
               state.players[i] = { ...player, pos: newPos };
            });
            break;
         default:
            window.alert('what');
      }
   }
};
