import { Player } from './types';
import './avatar.css';
import { mapPlayerModeToEmoji } from './startmenu/StartMenu';

type AvatarProps = {
   player: Player;
   active?: boolean;
};

export function Avatar({ player, active }: AvatarProps) {
   const { name, mode, color, queueueueueuedActions } = player;

   return (
      <div
         className={'avatar ' + (active ? 'avatar--active' : '')}
         style={{ backgroundColor: `rgb(${color})` }}
      >
         <div className="avatar__model">
            {mapPlayerModeToEmoji(mode)}
         </div>
         <div className="avatar__name">{name}</div>
         <div>{queueueueueuedActions.length}</div>
      </div>
   );
}
