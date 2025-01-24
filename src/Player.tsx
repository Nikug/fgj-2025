import { useEffect } from 'react';
import { Player as PlayerType, PlayerModelType, V2 } from './types';
import { cols, rows } from './App';
import { playSound } from './audio';
import { PlayerModel } from './Vilperi';

interface Props {
   player: PlayerType;
   setPosition: (newPos: V2) => void;
}

const loopBounds = (width: number, height: number, pos: V2) => {
   if (pos.x < 0) pos.x = width - 1;
   if (pos.y < 0) pos.y = height - 1;
   if (pos.x >= width) pos.x = 0;
   if (pos.y >= height) pos.y = 0;
   return pos;
};

export const Player = (props: Props) => {
   const { player, setPosition } = props;

   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         const newPos = { ...player.pos };
         if (e.key === 'ArrowUp') newPos.y -= 1;
         if (e.key === 'ArrowDown') newPos.y += 1;
         if (e.key === 'ArrowLeft') newPos.x -= 1;
         if (e.key === 'ArrowRight') newPos.x += 1;
         if (e.key === ' ') playSound('bonk');

         const looped = loopBounds(cols, rows, newPos);
         setPosition(looped);
      };

      addEventListener('keydown', handleKeyDown);

      return () => removeEventListener('keydown', handleKeyDown);
   }, [player.pos, setPosition]);

   return (
      <PlayerModel
         model={PlayerModelType.Monkey}
         color={player.color}
      />
   );
};
