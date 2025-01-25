import { useEffect } from 'react';
import {
   Player as PlayerType,
   PlayerModelType,
   V2,
   Action,
} from './types';
import { playSound } from './audio';
import { PlayerModel } from './Vilperi';
import { useMasterState } from './states/MasterState';

interface Props {
   player: PlayerType;
   setPosition: (newPos: V2) => void;
   queueueuAction: (actions: Action[]) => void;
}

const loopBounds = (width: number, height: number, pos: V2) => {
   if (pos.x < 0) pos.x = width - 1;
   if (pos.y < 0) pos.y = height - 1;
   if (pos.x >= width) pos.x = 0;
   if (pos.y >= height) pos.y = 0;
   return pos;
};

export const Player = (props: Props) => {
   const { player, queueueuAction } = props;
   const playerTurn = useMasterState(state => state.playerTurn);

   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (playerTurn !== player.id) return;

         const { pos, queueueueueuedActions } = player;
         const newPos = { ...pos };
         const newQueueueueueueueueueudActions =
            queueueueueuedActions.slice();
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
            newQueueueueueueueueueudActions.push(Action.MoveRight);
         }
         if (e.key === ' ') playSound('bonk');
         if (e.key === 'b') {
            newQueueueueueueueueueudActions.push(Action.Attack);
         }

         queueueuAction(newQueueueueueueueueueudActions);
      };

      addEventListener('keydown', handleKeyDown);

      return () => removeEventListener('keydown', handleKeyDown);
   }, [player.pos, playerTurn]);

   return (
      <PlayerModel
         model={PlayerModelType.Monkey}
         color={player.color}
      />
   );
};
