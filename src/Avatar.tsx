import { Player } from './types';

type AvatarProps = {
   player: Player;
};

export function Avatar({ player }: AvatarProps) {
   const { name, color } = player;

   return (
      <div>
         <div className="avatar">
            <div className="avatar__name">{name}</div>
            <div className="avatar__model">{color}</div>
         </div>
      </div>
   );
}