import { forwardRef, useEffect } from 'react';
import {
   Player as PlayerType,
   PlayerModelType,
   Action,
   GamePhase,
} from './types';
import { PlayerModel } from './Vilperi';
import { useMasterState } from './states/MasterState';
import { playSound } from './audio';

interface Props {
   player: PlayerType;
}

export const Player = forwardRef<HTMLDivElement | null, Props>(
   (props, ref) => {
      const { player } = props;
      const playerTurn = useMasterState(state => state.playerTurn);
      const qAction = useMasterState(state => state.queueueueAction);
      const waitingAction = useMasterState(
         state => state.waitingAction,
      );
      const setWaitingAction = useMasterState(
         state => state.setWaitingAction,
      );
      const allowKeyboard =
         useMasterState(state => state.gamePhase) ===
         GamePhase.Planning;

      const isOwnTurn = player.id === playerTurn;

      useEffect(() => {
         const handleKeyDown = (e: KeyboardEvent) => {
            if (playerTurn !== player.id) return;
            if (!allowKeyboard) return;

            const { pos } = player;
            const newPos = { ...pos };
            const newQueueueueueueueueueudActions: Action[] = [];
            let newWaitingAction = waitingAction;
            if (e.key === 'ArrowUp') {
               if (waitingAction) {
                  newQueueueueueueueueueudActions.push(
                     Action.AttackUp,
                  );
                  newWaitingAction = false;
                  playSound('attack');
               } else {
                  newPos.y -= 1;
                  newQueueueueueueueueueudActions.push(
                     Action.MoveUp,
                  );
                  playSound('move');
               }
            }
            if (e.key === 'ArrowDown') {
               if (waitingAction) {
                  newQueueueueueueueueueudActions.push(
                     Action.AttackDown,
                  );
                  newWaitingAction = false;
                  playSound('attack');
               } else {
                  newPos.y += 1;
                  newQueueueueueueueueueudActions.push(
                     Action.MoveDown,
                  );
                  playSound('move');
               }
            }
            if (e.key === 'ArrowLeft') {
               if (waitingAction) {
                  newQueueueueueueueueueudActions.push(
                     Action.AttackLeft,
                  );
                  newWaitingAction = false;
                  playSound('attack');
               } else {
                  newPos.x -= 1;
                  newQueueueueueueueueueudActions.push(
                     Action.MoveLeft,
                  );
                  playSound('move');
               }
            }
            if (e.key === 'ArrowRight') {
               if (waitingAction) {
                  newQueueueueueueueueueudActions.push(
                     Action.AttackRight,
                  );
                  newWaitingAction = false;
                  playSound('attack');
               } else {
                  newPos.x += 1;
                  newQueueueueueueueueueudActions.push(
                     Action.MoveRight,
                  );
                  playSound('move');
               }
            }
            if (e.key === ' ' || e.key === 'b' || e.key == 'B') {
               e.preventDefault();
               e.stopPropagation();
               setWaitingAction(true);
            } else {
               qAction(
                  player.id,
                  newQueueueueueueueueueudActions,
                  newWaitingAction,
               );
            }
         };

         addEventListener('keydown', handleKeyDown);

         return () => removeEventListener('keydown', handleKeyDown);
      }, [player.pos, playerTurn, waitingAction, allowKeyboard]);

      return (
         <PlayerModel
            ref={ref}
            id={player.elementId}
            model={player.mode}
            color={player.color}
            highlight={isOwnTurn}
         />
      );
   },
);
