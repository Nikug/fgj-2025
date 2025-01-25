import { forwardRef, useEffect } from 'react';
import {
   Player as PlayerType,
   PlayerModelType,
   Action,
} from './types';
import { PlayerModel } from './Vilperi';
import { useMasterState } from './states/MasterState';

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

      const isOwnTurn = player.id === playerTurn;

      useEffect(() => {
         const handleKeyDown = (e: KeyboardEvent) => {
            if (playerTurn !== player.id) return;

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
               } else {
                  newPos.y -= 1;
                  newQueueueueueueueueueudActions.push(
                     Action.MoveUp,
                  );
               }
            }
            if (e.key === 'ArrowDown') {
               if (waitingAction) {
                  newQueueueueueueueueueudActions.push(
                     Action.AttackDown,
                  );
                  newWaitingAction = false;
               } else {
                  newPos.y += 1;
                  newQueueueueueueueueueudActions.push(
                     Action.MoveDown,
                  );
               }
            }
            if (e.key === 'ArrowLeft') {
               if (waitingAction) {
                  newQueueueueueueueueueudActions.push(
                     Action.AttackLeft,
                  );
                  newWaitingAction = false;
               } else {
                  newPos.x -= 1;
                  newQueueueueueueueueueudActions.push(
                     Action.MoveLeft,
                  );
               }
            }
            if (e.key === 'ArrowRight') {
               if (waitingAction) {
                  newQueueueueueueueueueudActions.push(
                     Action.AttackRight,
                  );
                  newWaitingAction = false;
               } else {
                  newPos.x += 1;
                  newQueueueueueueueueueudActions.push(
                     Action.MoveRight,
                  );
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
      }, [player.pos, playerTurn, waitingAction]);

      return (
         <PlayerModel
            ref={ref}
            id={player.elementId}
            model={PlayerModelType.Monkey}
            color={player.color}
            highlight={isOwnTurn}
         />
      );
   },
);
