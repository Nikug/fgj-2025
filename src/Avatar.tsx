import { Player } from './types';
import './avatar.css';
import { mapPlayerModeToEmoji } from './startmenu/StartMenu';

type AvatarProps = {
   player: Player;
};

export function Avatar({ player }: AvatarProps) {
   const { name, mode } = player;

   return (
      <div>
         <div className="avatar">
            <div className="avatar__model">
               {mapPlayerModeToEmoji(mode)}
            </div>
            <div className="avatar__name">{name}</div>
         </div>
      </div>
   );
}
