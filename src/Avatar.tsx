import { Player } from './types';
import './avatar.css';
import './startmenu/startmenu.css';
import { mapPlayerModeToEmoji } from './startmenu/StartMenu';

type AvatarProps = {
   player: Player;
   active?: boolean;
   score: number;
};

export function Avatar({ player, active, score }: AvatarProps) {
   const { name, mode, color, queueueueueuedActions, isDead } =
      player;

   return (
      <div
         className={'avatar ' + (active ? 'avatar--active' : '')}
         style={{ backgroundColor: `rgb(${color})` }}
      >
         <div className="avatar__model">
            {isDead ? '☠️' : mapPlayerModeToEmoji(mode)}
         </div>
         <div className="avatar__name">{name}</div>
         {player.isAI && <p className="player-list-label">AI</p>}
         <div className="avatar__score__text">Moves:</div>
         <div className="avatar__number">
            {queueueueueuedActions.length}
         </div>
         <div className="avatar__score__text">Score:</div>
         <span className="avatar__score__number avatar__number">
            {score}
         </span>
      </div>
   );
}
