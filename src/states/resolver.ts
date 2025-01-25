import { cols, rows } from '../App';
import { id } from '../id';
import { shuffleList } from '../random';
import { sleep } from '../sleep';
import { Action, GamePhase } from '../types';
import { useMasterState } from './MasterState';

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
                  state.players[playerIndex].pos = newPos;
               });
               break;
            case Action.MoveDown:
               useMasterState.setState(state => {
                  newPos.y += 1;
                  if (newPos.y >= rows) newPos.y = rows - 1;
                  state.players[playerIndex].pos = newPos;
               });
               break;
            case Action.MoveLeft:
               useMasterState.setState(state => {
                  newPos.x -= 1;
                  if (newPos.x < 0) newPos.x = 0;
                  state.players[playerIndex].pos = newPos;
               });
               break;
            case Action.MoveRight:
               useMasterState.setState(state => {
                  newPos.x += 1;
                  if (newPos.x >= cols) newPos.x = cols - 1;
                  state.players[playerIndex].pos = newPos;
               });
               break;
            case Action.Attack:
               console.log(player.id + " attaaaaaaaaak");
               useMasterState.setState(state => {
                  state.attaaak(player.id, player.pos)
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
   });
};
