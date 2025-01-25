import { Player } from './types';
import './avatar.css';
import { mapPlayerModeToEmoji } from './startmenu/StartMenu';

type AvatarProps = {
   player: Player;
};

export function Avatar({ player }: AvatarProps) {
   const { name, mode, color, queueueueueuedActions } = player;

   return (
      <div>
         <div
            className="avatar"
            style={{ backgroundColor: `rgb(${color})` }}
         >
            <div className="avatar__model">
               {mapPlayerModeToEmoji(mode)}
            </div>
            <div className="avatar__name">{name}</div>
            <div>{queueueueueuedActions.length}</div>
         </div>
      </div>
   );
}
