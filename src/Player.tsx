import { forwardRef, useEffect } from 'react';
import {
   Player as PlayerType,
   PlayerModelType,
   Action,
} from './types';
import { playSound } from './audio';
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

      useEffect(() => {
         const handleKeyDown = (e: KeyboardEvent) => {
            if (playerTurn !== player.id) return;

            const { pos } = player;
            const newPos = { ...pos };
            const newQueueueueueueueueueudActions: Action[] = [];
            if (e.key === 'ArrowUp') {
               newPos.y -= 1;
               newQueueueueueueueueueudActions.push(Action.MoveUp);
            }
            if (e.key === 'ArrowDown') {
               newPos.y += 1;
               newQueueueueueueueueueudActions.push(Action.MoveDown);
            }
            if (e.key === 'ArrowLeft') {
               newPos.x -= 1;
               newQueueueueueueueueueudActions.push(Action.MoveLeft);
            }
            if (e.key === 'ArrowRight') {
               newPos.x += 1;
               newQueueueueueueueueueudActions.push(
                  Action.MoveRight,
               );
            }
            if (e.key === ' ') playSound('bonk');
            if (e.key === 'b') {
               newQueueueueueueueueueudActions.push(Action.Attack);
            }

            qAction(player.id, newQueueueueueueueueueudActions);
         };

         addEventListener('keydown', handleKeyDown);

         return () => removeEventListener('keydown', handleKeyDown);
      }, [player.pos, playerTurn]);

      return (
         <PlayerModel
            ref={ref}
            id={player.elementId}
            model={PlayerModelType.Monkey}
            color={player.color}
         />
      );
   },
);
