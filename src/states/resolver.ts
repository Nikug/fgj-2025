import { cols, rows } from '../App';
import { shuffleList } from '../random';
import { sleep } from '../sleep';
import { Action, GamePhase } from '../types';
import { useMasterState } from './MasterState';
import { playerOverlap } from './notUtils';

const TimeBetweenActions = 500;

export const resolver = async () => {
   await sleep(TimeBetweenActions);

   useMasterState.setState(state => shuffleList(state.players));

   // Main loop
   for (
      let playerIndex = 0;
      playerIndex < useMasterState.getState().players.length;
      playerIndex++
   ) {
      useMasterState.setState(state => {
         state.playerTurn = state.players[playerIndex].id;
      });

      for (
         let actionIndex = 0;
         actionIndex <
         useMasterState.getState().players[playerIndex]
            .queueueueueuedActions.length;
         actionIndex++
      ) {
         const player =
            useMasterState.getState().players[playerIndex];
         const action = player.queueueueueuedActions[actionIndex];

         const newPos = { ...player.pos };
         console.log('Action', action);
         switch (action) {
            case Action.MoveUp:
               useMasterState.setState(state => {
                  newPos.y -= 1;
                  if (newPos.y < 0) newPos.y = 0;
                  if (!playerOverlap(newPos, state.players)) {
                     state.players[playerIndex].pos = newPos;
                  }
               });
               break;
            case Action.MoveDown:
               useMasterState.setState(state => {
                  newPos.y += 1;
                  if (newPos.y >= rows) newPos.y = rows - 1;
                  if (!playerOverlap(newPos, state.players)) {
                     state.players[playerIndex].pos = newPos;
                  }
               });
               break;
            case Action.MoveLeft:
               useMasterState.setState(state => {
                  newPos.x -= 1;
                  if (newPos.x < 0) newPos.x = 0;
                  if (!playerOverlap(newPos, state.players)) {
                     state.players[playerIndex].pos = newPos;
                  }
               });
               break;
            case Action.MoveRight:
               useMasterState.setState(state => {
                  newPos.x += 1;
                  if (newPos.x >= cols) newPos.x = cols - 1;
                  if (!playerOverlap(newPos, state.players)) {
                     state.players[playerIndex].pos = newPos;
                  }
               });
               break;
            case Action.Attack:
               useMasterState.setState(state => {
                  state.createAttaaak(player.pos, 'ltr')
               })
               break;
            default:
               window.alert('what');
         }

         await sleep(TimeBetweenActions);
      }
   }

   await sleep(TimeBetweenActions);

   useMasterState.setState(state => {
      state.gamePhase = GamePhase.Planning;
      state.players = state.players.map(player => ({
         ...player,
         queueueueueuedActions: [],
      }));
      state.players = shuffleList(state.players);
      state.playerOrder = state.players.map(p => p.id);
      state.playerTurn = state.players[0].id;
   });
};
