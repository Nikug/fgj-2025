import { Player } from './types';
import './avatar.css';

type AvatarProps = {
   player: Player;
};

export function Avatar({ player }: AvatarProps) {
   const { name, mode, queueueueueuedActions } = player;

   return (
      <div>
         <div className="avatar">
            <div className="avatar__model">{mode}</div>
            <div className="avatar__name">{name}</div>
            <div>{queueueueueuedActions}</div>
         </div>
      </div>
   );
}
